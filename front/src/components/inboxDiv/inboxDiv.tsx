import styles from './inboxDiv.module.css'
import { SearchInbox } from "../searchInbox/searchInbox.tsx";
import { ChatAll, ChatMine, ChatUnassigned } from '../ChatsDiv/index.tsx';
import { useMessageCount } from '../../hooks/useMessageCount';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import useSeparatedConversations from '../../hooks/useSeparatedConversations.ts';

export const InboxDive: React.FC = () => {
    const { conversations, mineConversation, unassignedConversation } = useSeparatedConversations()
    const { all, mine, unassigned} = useMessageCount()
    return (
        <Tabs defaultValue='mine' className={styles.contenedorConversation} onKeyDown={() => console.log(conversations)}>
            <SearchInbox ></SearchInbox>
            <TabsList>
                <TabsTrigger value="mine">Mías {isValid(mine) && ` - ${mine}`}</TabsTrigger>
                <TabsTrigger value="unassigned">No asignadas {isValid(unassigned) && ` - ${unassigned}`}</TabsTrigger>
                <TabsTrigger value="all">Todas {isValid(all) && ` - ${all}`}</TabsTrigger>
            </TabsList>
            <TabsContent value='mine'>
                <ChatMine conversations={mineConversation} />
            </TabsContent>
            <TabsContent value='unassigned'>
                <ChatUnassigned conversations={unassignedConversation} />
            </TabsContent>
            <TabsContent value='all'>
                <ChatAll conversations={conversations} />
            </TabsContent>
            {/* <ChatsDiv tab={tab} /> */}
        </Tabs>
    );
}

const isValid = (data:number | string) => data !== 0 && data !== "0"