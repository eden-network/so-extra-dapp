import { ReactElement } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Modal = ({
    title,
    open,
    onClose,
    children
}: {
    title: string,
    open: boolean,
    onClose: () => void,
    children: ReactElement
}) => {
    return (
        <>
            <div onClick={onClose} className={`fixed top-0 left-0 z-50 w-full h-full bg-extra-pink/10 items-center backdrop-blur-lg overflow-y-auto ${open ? "block" : "hidden"}`}>
                <div
                    onClick={e => e.stopPropagation()}
                    style={{ transform: 'translate(-50%, -50%)' }}
                    className="fixed bg-[#190E17A8] z-20 h-auto top-1/2 left-2/4 flex flex-col gap-10 items-center py-12 rounded-xl border-2 border-extra-pink min-w-[800px] mt-12">
                    <div>
                        <h1 className="text-rainbow-yellow text-bold text-2xl font-modelica-bold">{title}</h1>
                    </div>
                    <div>
                        {children}
                    </div>
                    <div onClick={onClose} className="cursor-pointer flex flex-col items-center absolute right-3 top-3 text-white">
                        <XMarkIcon className="w-5 h-5 text-white" />
                        <button type="button">Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal