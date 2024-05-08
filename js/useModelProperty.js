function useModelProperty(model, propertyName){
  const [value, setValue] = React.useState(model[propertyName]);
  React.useEffect( function(){
      function obs(){ setValue(model[propertyName]); }
      return model.addObserver(obs);
   }, [model]);
  return value;
}
