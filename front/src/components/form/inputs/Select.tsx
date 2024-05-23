import { useEffect, useRef, useState } from "react"
import useClickOutside from "../../../hooks/useClickOutside"
import { Control, Controller } from "react-hook-form"
import styles from "./index.module.css"
import { selectContext } from "../../../hooks/useMultiSelect"
import GlassIcon from "../../icons/GlassIcon"

type Props = {
    label: string
    name: string
    control: Control<any, any, any>
    search?: boolean
    children?: React.ReactNode
    transparent?: boolean
    dark?: boolean
}


export default function Select({ label, name, control, transparent, dark, children, search }: Props) {
    const [searchText, setSearchText] = useState("")
    const [inputLabel, setInputLabel] = useState(label)
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    useClickOutside(containerRef, () => setOpen(false))
    const searchFilterFunction = (label: string) => {
        return !search || label.toLowerCase().includes(searchText)
    }
    useEffect(() => {
        if (open && searchRef.current) {
            searchRef.current.focus()
        }
    }, [open])

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const { value, onChange: setValue } = field
                return (
                    <selectContext.Provider value={{
                        value, name, searchFilterFunction, resetFilters: () => setSearchText(""), setValue: ({ value, label }) => {
                            setValue(value)
                            setOpen(false)
                            setInputLabel(label)
                        }
                    }}>
                        <div className={`${styles.inputGroup} ${open && styles.activeSelect}`} ref={containerRef}>
                            <label className={`${styles.input} ${styles.button} ${transparent && styles.transparent} ${dark && styles.dark}`}>
                                <input type="checkbox" checked={open} onChange={e => setOpen(e.target.checked)} className={styles.selectButton} />
                                <span>{inputLabel}</span>
                            </label>
                            <div className={`${styles.optionsMenu}`}>
                                {
                                    search && (
                                        <div className={styles.selectSearch}>
                                            <input
                                                ref={searchRef}
                                                type="search"
                                                className={`${styles.input} ${value !== "" && styles.valid}`}
                                                value={searchText}
                                                onChange={evt => setSearchText(evt.target.value)}
                                            />
                                            <GlassIcon />
                                        </div>
                                    )
                                }
                                <div className={styles.options}>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </selectContext.Provider>
                )
            }}
        />
    )
}