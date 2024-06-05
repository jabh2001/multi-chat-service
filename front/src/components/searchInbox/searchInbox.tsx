import { Input } from '@/components/ui/input'
import { useInnerConversationStore } from '../../hooks/useSeparatedConversations'
import './searchInbox.css'
export const SearchInbox: React.FC = () => {
    const search = useInnerConversationStore(store => store.search)
    const setSearch = useInnerConversationStore(store => store.setSearch)

    return (
        <div className='searchearContainer'>
            <Input
                placeholder='search for message in conversations' 
                value={search} 
                onChange={(evt) => setSearch(evt.target.value)}
            />
        </div>
    )

}