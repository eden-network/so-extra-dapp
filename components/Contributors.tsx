import Link from "next/link"

const Contributors = () => {
    return (
        <div className="mb-6">
            <h2 className="text-2xl text-center text-rainbow-yellow font-modelica-bold pb-3">
                {'Contributors'}
            </h2>
            <div className="grid grid-cols-1 m-auto w-fit m-auto gap-4">
                <Link href={"https://twitter.com/MihaLotric"} target="_blank">
                    <div className="text-center hover:underline">
                        <p>@MihaLotric</p>
                    </div>
                </Link>
                <Link href={"https://twitter.com/calebsheridan"} target="_blank">
                    <div className="text-center hover:underline">
                        <p>@calebsheridan</p>
                    </div>
                </Link>
                <Link href={"https://twitter.com/dtj5179"} target="_blank">
                    <div className="text-center hover:underline">
                        <p>@dorianjanezic</p>
                    </div>
                </Link>
                <Link href={"https://twitter.com/Noiseincolor"} target="_blank">
                    <div className="text-center hover:underline">
                        <p>@noiseincolor</p>
                    </div>
                </Link>
                <Link href={"https://twitter.com/zeroXbrock"} target="_blank">
                    <div className="text-center hover:underline">
                        <p>@zeroXbrock</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Contributors