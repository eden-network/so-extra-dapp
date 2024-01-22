import useLogs from "../hooks/useLogs"

const LeaderBoard = () => {
    const { logs } = useLogs()
    const postSummary: Record<string, number> = {}

    for (const log of logs) {
        postSummary[log.args.extra] = postSummary[log.args.extra] + 1 || 0
    }

    return <div className="h-52 flex flex-col pb-3 bg-gradient-to-b from-white to-rwhite/20 bg-clip-text text-transparent">
        <div className="pt-2 pb-3">
        </div>
        <div className="px-2 my-2">
            <div className="w-full text-center text-sm">
                <div className="text-left">
                    <div className="flex gap-9">
                        {/* <div>Posts</div>
                        <div>Popoluar Messages</div> */}
                        {/* <th>Posts</th> */}
                    </div>
                </div>
                <div className="">
                    {Object.keys(postSummary).map(post => <div key={post}>
                        <div className="flex gap-9">
                            <div className="flex w-1">{postSummary[post]}</div>
                            <div className="">{post}</div>
                        </div>
                        {/* <td>{`${Math.round(Math.random() * 100 * postSummary[post])}`}</td> */}
                    </div>)}
                </div>
            </div>
        </div>
    </div>
}

export default LeaderBoard