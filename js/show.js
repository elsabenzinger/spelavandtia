function Show(props) {
  // Only look at the first part of the hash, e.g. #game and #login, and exlude additional information such as gameId.
  const [hash, _] = props.currentHash.split("-");
  const hide = props.hash === hash ? "" : "hidden";
  return (
      hide ? null : <>{props.children}</>
  );
}
