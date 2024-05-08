//Same as in tutorial week
function usePromise(promise){
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  React.useEffect(
      function(){
        setData(null);
        setError(null);
        let cancelled = false;
          if(promise){
            promise.then(dt=>{if(!cancelled) setData(dt);})
              .catch(er=>{if(!cancelled) setError(er)});
          }
        return () => { cancelled = true; };
      },
        [promise]
    );
  return [data, error];
}
