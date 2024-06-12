import { useInnerConversationStore } from '../../hooks/useSeparatedConversations'
import './searchInbox.css'
export const SearchInbox: React.FC = () => {
    const search = useInnerConversationStore(store => store.search)
    const setSearch = useInnerConversationStore(store => store.setSearch)

    return (
        <div className='searchearContainer'>
            <input 
                className='py-2 px-2 border-2 border-gray-200 rounded-2xl w-full bg-transparent text-primary'
                placeholder='Busca un chat' 
                value={search} 
                onChange={(evt) => setSearch(evt.target.value)}
            />
        </div>
    )

}