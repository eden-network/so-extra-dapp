import useLogs from "../hooks/useLogs"

const LeaderBoard = () => {
    const { logs } = useLogs()
    const postSummary: Record<string, number> = {}

    for (const log of logs) {
        postSummary[log.args.extra] = postSummary[log.args.extra] + 1 || 0
    }

    return <div className="h-72 flex flex-col pb-3 bg-gradient-to-b from-white to-rwhite/80 bg-clip-text text-transparent">
        <div className="pt-2 pb-3">
            <h1 className="text-center font-modelica-bold text-2xl text-rainbow-yellow">So Extra Leaderboard</h1>
        </div>
        <div className="border border-white/30 p-2">
            <div className="flex flex-col justify-center text-center text-sm">
                <div className="text-center">
                    <div className="flex gap-[1.7rem] mb-2 font-modelica-bold">
                        <div>Points</div>
                        <div className="text-left">Extra Data</div>
                    </div>
                </div>
                <div className="overflow-hidden">
                    {Object.keys(postSummary).sort((a, b) => postSummary[b] - postSummary[a]).slice(0, 10).map(post =>
                        <div className="w-fit overflow-hidden text-wrap" key={post}>
                            <div className="flex gap-16 font-modelica-bold text-wrap overflow-hidden">
                                <div className="flex w-1 text-right">{postSummary[post]}</div>
                                <div className="ml-1 text-left overflow-hidden text-wrap">{post}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
}

export default LeaderBoard