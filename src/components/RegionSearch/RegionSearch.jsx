import React from 'react';
import { useRouter } from 'next/router'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { firebase } from '../../services/firebase';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

async function lookupRegion(search) {
console.log("### looking up", search);
  const database = firebase.firestore();
  const collection = database.collection("fips");
  const startSearch = search[0].toUpperCase() + search.substring(1);
  const endSearch = startSearch + 'zzz';

console.log("### looking up", startSearch);

  // const query = collection.where("name", ">=", startSearch);
  const query = collection.where("name", ">=", startSearch).where("name", "<", endSearch);
  const docRefs = await query.get();
  const docs = [];

  // console.log("### docRefs", docRefs);

  docRefs.forEach(docRef => docs.push(docRef.data()));

  // console.log("#### result", docs);
  return docs;
}

export default function Asynchronous() {
  const router = useRouter();
  const [ open, setOpen ] = React.useState(false);
  const [ options, setOptions ] = React.useState([]);
  const [ inputValue, setInputValue ] = React.useState('');
  const loading = open && options.length === 0 && inputValue.length > 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const regions = await lookupRegion(inputValue);

      // TODO: Add support for states here

      if (active) {
        setOptions(regions.map(region => ({
          name: `${region.name}, ${region.state}`,
          value: region.fips
            ? `/${region.state}/${encodeURIComponent(region.fips)}`
            : `/${region.state}`,
        })));
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);

        if (newInputValue === '') {
          setOptions([]);
        }
      }}
      onChange={(event, newValue) => {
        console.log("$$$ got new value", newValue);
        router.push(newValue.value);
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for state or county"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
