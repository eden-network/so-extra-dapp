const LeaderBoard = () => {
    return <div className="flex flex-col pb-3">
        <div className="pt-2 pb-3">
            <h2 className="text-2xl text-center font-bold text-yellow-300">
                Big Point Earners
            </h2>
        </div>
        <div className="px-2 my-2">
            <table className="w-full text-center text-sm">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Account</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>One</td>
                        <td>123</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Two</td>
                        <td>123</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Three</td>
                        <td>123</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Four</td>
                        <td>123</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Five</td>
                        <td>123</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}

export default LeaderBoard