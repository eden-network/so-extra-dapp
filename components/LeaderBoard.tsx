const LeaderBoard = () => {
    return <div className="flex flex-col pb-3">
        <div className="border-b pt-2 pb-3">
            <h2 className="text-2xl text-center font-semibold">
                Big Spenders
            </h2>
        </div>
        <div className="px-2 my-2">
            <ol className="list-decimal list-inside">
                <li>One</li>
                <li>Two</li>
                <li>Three</li>
            </ol>
        </div>
    </div>
}

export default LeaderBoard