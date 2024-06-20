import useSeparatedConversations from "../../../hooks/useSeparatedConversations";
import { useMessageCount } from "../../../hooks/useMessageCount";
import ChatsDiv from "../../../components/ChatsDiv";
import { useMemo, useState } from "react";

export default function ConversationSection(){
    const [tab, setTab] = useState(0)
    const { mineConversation, unassignedConversation, conversations } = useSeparatedConversations()
    const { all, mine, unassigned } = useMessageCount()
    const allTabs = useMemo(() => [
        { name: 'Mine', count: mine, conversations:mineConversation },
        { name: 'Unassigned', count: unassigned, conversations:unassignedConversation },
        { name: 'All', count: all, conversations:conversations },

    ], [mine, unassigned, all])
    return (
      <section className="flex flex-col flex-none overflow-auto w-24  group lg:max-w-sm md:w-2/5 transition-all duration-300 ease-in-out max-h-screen">
        <div className="search-box p-4 flex-none">
            <form>
                <div className="relative">
                    <label>
                        <input className="rounded-full py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                              type="text" value="" placeholder="Search Messenger"/>
                        <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                            <svg viewBox="0 0 24 24" className="w-6 h-6">
                                <path fill="#bbb"
                                      d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/>
                            </svg>
                        </span>
                    </label>
                </div>
            </form>
        </div>
        <div className="search-box p-4 flex-none">
            <ConversationTab
                tab={tab}
                setTab={setTab}
                tabs={allTabs}
            />
        </div>
        
        <div className="contacts p-2 flex-1 overflow-y-scroll">
            {
                allTabs.map(({ name, conversations }, i) => i === tab ? <ChatsDiv conversations={conversations} prefix={name} /> : null)
            }
        </div>
    </section>
    )
}

function ConversationTab({ tab, setTab, tabs }:{tab:number, setTab:(num:number) => void, tabs:Array<{ name:string, count:number|string|undefined}>}) {
    return (
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue={0}
            value={tab}
            onChange={(e) => setTab(Number(e.target.value))}
          >
            {tabs.map((tab, index) => (
                <option key={"tab_option_"+tab.name} value={index}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex justify-between" aria-label="Tabs">
              {tabs.map(({name, count}, i) => (
                <a
                  key={name}
                  href="#"
                  className={classNames(
                    tab === i
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                    'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex-1 flex justify-center items-center'
                  )}
                  aria-current={tab === i ? 'page' : undefined}
                  onClick={() => setTab(i)}
                >
                  {name}
                  {count ? (
                    <span
                      className={classNames(
                        tab === i ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                        'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block'
                      )}
                    >
                      {count}
                    </span>
                  ) : null}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    )
  }
  
function classNames(...classes:string[]) {
    return classes.filter(Boolean).join(' ')
  }