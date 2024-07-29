import Link from "next/link"

const Contributors = () => {
    return (
        <div>
            <h2 className="text-2xl text-center text-rainbow-yellow font-modelica-bold pb-3">
                {'Contributors'}
            </h2>
            <div className="grid grid-cols-2 m-auto w-fit m-auto gap-4">
                <Link href={"https://twitter.com/MihaLotric"}>
                    <div className="text-left">
                        <p>Miha Lotric</p>
                        <p className="text-xs text-white/30">@MihaLotric</p>
                    </div>
                </Link>
                <Link href={"https://twitter.com/MihaLotric"}>
                    <div className="text-left">
                        <p>Caleb</p>
                        <p className="text-xs text-white/30">@calebsheridan</p>
                    </div>
                </Link>
                <Link href={"https://twitter.com/MihaLotric"}>
                    <div className="text-left">
                        <p>Dorian Janezic</p>
                        <p className="text-xs text-white/30">@dorianjanezic</p>
                    </div>
                </Link>
                <Link href={"https://twitter.com/MihaLotric"}>
                    <div className="text-left">
                        <p>Peter</p>
                        <p className="text-xs text-white/30">@noisecolor</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Contributors