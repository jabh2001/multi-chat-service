import { useInnerConversationStore } from '../../hooks/useSeparatedConversations'
import './searchInbox.css'
export const SearchInbox: React.FC = () => {
    const search = useInnerConversationStore(store => store.search)
    const setSearch = useInnerConversationStore(store => store.setSearch)

    return (
        <div className='searchearContainer'>
            <div className="principalBar">
                <button className="botonDespliegue ">a1</button>
            </div>
            <input 
                className='searcher'
                placeholder='search for message in conversations' 
                value={search} 
                onChange={(evt) => setSearch(evt.target.value)}
            />
            <div className='searcherBtn'>

                <button >a2</button>
            </div>
        </div>
    )

}