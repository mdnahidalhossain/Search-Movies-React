function Search({ search, setSearch }) {
    return (
        <>
            <div className="search">
                <div>
                    <img src="search.svg" alt="search-icon" />
                    <input
                        type="text"
                        name="search-field"
                        placeholder="Search 300+ movies"
                        value={search} 
                        onChange={(event) => {
                            setSearch(event.target.value); 
                            console.log(event.target.value)
                        }} 
                    />
                </div>
            </div>
        </>
    )
}

export default Search