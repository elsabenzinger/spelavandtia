function RulesPresenter(props){
    return (
        <div>
            <RulesView
                 menu={() => {window.location.hash = "#main";}}  // Go to mainView
            />
        </div>
    );
}