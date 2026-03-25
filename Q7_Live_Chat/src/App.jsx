import "./App.css";
import { StreamHeader } from "./components/StreamHeader";
import { ChatFeed } from "./components/ChatFeed";
import { NewMessagesButton } from "./components/NewMessagesButton";
import { ChatInput } from "./components/ChatInput";
import { useLiveChatDemo } from "./hooks/useLiveChatDemo";

export default function App() {
  const {
    feedRef,
    messages,
    input,
    isStreaming,
    isTyping,
    stickToBottom,
    newCount,
    viewers,
    showOwnTyping,
    toggleStream,
    handleScroll,
    handleInputChange,
    handleKeyDown,
    sendMessage,
    jumpToBottom,
  } = useLiveChatDemo();

  return (
    <div className="app">
      <StreamHeader
        isStreaming={isStreaming}
        viewers={viewers}
        onToggleStream={toggleStream}
      />

      <div className="chat-wrapper">
        <ChatFeed
          feedRef={feedRef}
          onScroll={handleScroll}
          messages={messages}
          isTyping={isTyping}
        />

        {!stickToBottom && (
          <NewMessagesButton
            newCount={newCount}
            onJumpToBottom={jumpToBottom}
          />
        )}

        <ChatInput
          input={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSend={sendMessage}
          disabled={!input.trim()}
          showOwnTyping={showOwnTyping}
        />
      </div>
    </div>
  );
}
