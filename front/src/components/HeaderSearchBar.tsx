import ArrowIcon from "./icons/ArrowIcon"
import CloseIcon from "./icons/CloseIcon"
import GlassIcon from "./icons/GlassIcon"

type Props = {
    placeholder:string
    value?:string
    onChange?:(value: string) => void
    onRemove?:()=>void
    onSearch?:()=>void
}

export default function HeaderSearchBar({ placeholder, value, onChange, onRemove, onSearch }:Props){
    return (
        <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 border-gray-400 border-b-2">
            {/* <h3>Contacts</h3> */}
            <div className="flex w-full py-4">
                <div className="px-4 flex gap-4 flex-1">
                    <div className="h-full flex flex-col justify-center fill-gray-400">
                        <GlassIcon />
                    </div>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={evt => onChange && onChange(evt.target.value)}
                        className="w-full bg-transparent px-2 py-4 text-gray-500 focus:outline-none xl:w-125 flex-1"
                    />
                    <button className="h-full flex flex-col justify-center fill-gray-400 transition hover:fill-red-500" onClick={onRemove}>
                        <CloseIcon />
                    </button>
                    <button className="h-full flex flex-col justify-center fill-gray-400 transition hover:fill-emerald-500 hover:rotate-90" onClick={onSearch}>
                        <ArrowIcon />
                    </button>
                </div>

            </div>
        </header>
    )
}