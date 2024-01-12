import useLogs from "../hooks/useLogs"

const LeaderBoard = () => {
    const { logs } = useLogs()
    const postSummary: Record<string, number> = {}

    for (const log of logs) {
        postSummary[log.args.extra] = postSummary[log.args.extra] + 1 || 0
    }
    
    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-yellow-300">
                Popular Posts
            </h2>
        </div>
        <div className="px-2 my-2">
            <table className="w-full text-center text-sm">
                <thead>
                    <tr>
                        <th>Message</th>
                        {/* <th>Posts</th> */}
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(postSummary).map(post => <tr key={post}>
                        <td>{post}</td>
                        <td>{postSummary[post]}</td>
                        {/* <td>{`${Math.round(Math.random() * 100 * postSummary[post])}`}</td> */}
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>
}

export default LeaderBoard