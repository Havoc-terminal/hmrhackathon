import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Paperclip, 
  FileText, 
  ArrowUpRight, 
  Wand2, 
  Search,
  Plus,
  Play,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  CheckCircle2,
  Calendar as CalIcon,
  Mail,
  CheckSquare,
  ArrowRight,
  Clock,
  Radio
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function AiAssistantChat() {
  const { 
    chatMessages, 
    sendChatMessage, 
    setIsTemplateModalOpen, 
    startAgentExecution,
    setCurrentView
  } = useKaarya();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceResponseEnabled, setVoiceResponseEnabled] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceError, setVoiceError] = useState(null);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isListening]);

  // Clean up speech synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Text-To-Speech: Speak assistant confirmation aloud
  const speakVoiceResponse = (text) => {
    if (!voiceResponseEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      // Clean text of markdown asterisks, hashes, urls
      const cleanText = text
        .replace(/[*_#`~]/g, '')
        .replace(/https?:\/\/\S+/g, 'link')
        .replace(/meet\.google\.com\/\S+/g, 'Google Meet');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Jenny'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Process user command (from voice or typing)
  const handleExecuteCommand = (commandText, isVoice = false) => {
    if (!commandText || !commandText.trim()) return;

    stopSpeaking();
    setLiveTranscript('');

    sendChatMessage(commandText, (aiReply) => {
      if (voiceResponseEnabled && aiReply?.text) {
        speakVoiceResponse(aiReply.text);
      }
    }, isVoice);

    setInputVal('');
  };

  // Start Voice Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    stopSpeaking();
    setVoiceError(null);

    const SpeechRecognition = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;

    if (!SpeechRecognition) {
      setVoiceError('Speech recognition is not supported in this browser. You can click any Quick Voice Note chip below or type your command!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setLiveTranscript(currentTranscript);

        // If recognized final speech
        if (event.results[event.results.length - 1].isFinal) {
          setIsListening(false);
          handleExecuteCommand(currentTranscript, true);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission was denied. You can click any Quick Voice chip or type in the input bar.');
        } else if (event.error !== 'no-speech') {
          setVoiceError(`Voice notice: ${event.error}. You can also type or click any quick command chip.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setVoiceError('Could not start microphone. You can click any Quick Voice chip or type below.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleExecuteCommand(inputVal, false);
  };

  const handleRunSuggestedWorkflow = (prompt) => {
    setCurrentView('dashboard');
    startAgentExecution(prompt);
  };

  return (
    <div className="assistant-split-container">
      {/* Left Column: Chat Results / Quick Prompt Shortcuts */}
      <div className="assistant-left-sidebar">
        <div className="left-sidebar-header">
          <h2 className="sidebar-group-title">Chat Results</h2>
          <button 
            type="button" 
            className="new-chat-icon-btn"
            onClick={() => handleExecuteCommand("Start fresh context", false)}
            title="New Chat"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Today Section */}
        <div className="history-group">
          <div className="group-timestamp-label">Voice & Automation Shortcuts</div>
          <div className="chat-result-card ai-search-card">
            <div className="result-card-top">
              <div className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
                <Sparkles size={13} className="text-teal-600" />
                <span>Autonomous Cross-App Actions</span>
              </div>
            </div>

            <div className="ai-search-chips">
              <button 
                type="button" 
                className="ai-search-pill"
                onClick={() => handleExecuteCommand("Reschedule Quarterly Strategy Review to 4:00 PM and send an email to Sarah Jenkins", true)}
              >
                🎙️ Reschedule to 4 PM & Email Sarah
              </button>
              <button 
                type="button" 
                className="ai-search-pill"
                onClick={() => handleExecuteCommand("Sync my Gmail threads and schedule any detected meetings", true)}
              >
                🎙️ Sync Gmail & Auto-Schedule
              </button>
              <button 
                type="button" 
                className="ai-search-pill"
                onClick={() => handleExecuteCommand("Add high priority task: Finalize Q4 Roadmap Presentation by tomorrow", true)}
              >
                🎙️ Add High Priority Task
              </button>
              <button 
                type="button" 
                className="ai-search-pill"
                onClick={() => handleExecuteCommand("What meetings do I have scheduled on my calendar today?", true)}
              >
                🎙️ What's my schedule today?
              </button>
            </div>
          </div>
        </div>

        {/* Yesterday Section */}
        <div className="history-group">
          <div className="group-timestamp-label">Direct App Navigation</div>
          <div className="ai-search-chips">
            <button 
              type="button" 
              className="ai-search-pill"
              onClick={() => handleExecuteCommand("Open Calendar", true)}
            >
              📅 Open Google Calendar
            </button>
            <button 
              type="button" 
              className="ai-search-pill"
              onClick={() => handleExecuteCommand("Open Tasks", true)}
            >
              📋 Open Tasks Board
            </button>
            <button 
              type="button" 
              className="ai-search-pill"
              onClick={() => handleExecuteCommand("Open Gmail", true)}
            >
              ✉️ Open Gmail Threads
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Active Conversation & Big Voice Note Console */}
      <div className="assistant-right-chat">
        {/* Chat View Header */}
        <div className="chat-view-header">
          <div className="flex items-center gap-2">
            <div className="ai-logo-sphere">
              <Sparkles size={16} className="text-teal-600" />
            </div>
            <div>
              <h3 className="chat-view-title">DailyEcho Autonomous Voice Assistant</h3>
              <span className="text-[11px] text-gray-500">
                Voice & Typing Multi-App Coordinator (Calendar, Gmail, Tasks)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`voice-toggle-btn ${voiceResponseEnabled ? 'active' : ''}`}
              onClick={() => setVoiceResponseEnabled(!voiceResponseEnabled)}
              title="Toggle Assistant Voice Output"
            >
              {voiceResponseEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{voiceResponseEnabled ? 'Voice Output: ON' : 'Voice Output: OFF'}</span>
            </button>

            {isSpeaking && (
              <button
                type="button"
                className="btn btn-secondary btn-pill text-xs flex items-center gap-1 text-red-600"
                onClick={stopSpeaking}
                title="Stop Audio Speech"
              >
                <Square size={11} fill="currentColor" />
                <span>Stop Voice</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. THE BIG VOICE NOTE HERO CONSOLE */}
        <div className="ai-voice-hero-banner">
          <div className="voice-hero-main-row">
            <div className="voice-hero-left">
              {/* Big Glowing Voice Orb */}
              <div className="big-voice-orb-container">
                <button
                  type="button"
                  className={`big-voice-orb ${isListening ? 'listening' : isSpeaking ? 'speaking' : ''}`}
                  onClick={toggleListening}
                  title={isListening ? 'Listening... Tap to stop' : 'Tap to speak a voice note'}
                >
                  {isListening ? (
                    <Radio size={28} className="animate-pulse" />
                  ) : isSpeaking ? (
                    <Volume2 size={28} />
                  ) : (
                    <Mic size={28} />
                  )}
                </button>
                <div className="voice-ring-pulse" />
              </div>

              {/* Title & Live Equalizer Waveform */}
              <div className="voice-title-col">
                <div className="voice-title-badge-row">
                  <h4 className="voice-main-title">
                    {isListening ? 'Listening to your voice...' : isSpeaking ? 'Speaking response...' : 'Tap to Record Voice Note'}
                  </h4>

                  {isListening ? (
                    <span className="voice-status-pill listening">
                      ● Recording Live
                    </span>
                  ) : isSpeaking ? (
                    <span className="voice-status-pill speaking">
                      🔊 Audio Active
                    </span>
                  ) : (
                    <span className="voice-status-pill ready">
                      ⚡ Voice & Typing Ready
                    </span>
                  )}
                </div>

                <p className="voice-sub-desc">
                  Speak instructions to reschedule meetings, email attendees, add tasks, or manage your workspace.
                </p>

                {/* Animated Soundwave Equalizer Bars */}
                <div className={`voice-equalizer-bars ${isListening || isSpeaking ? 'active' : ''}`}>
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                </div>
              </div>
            </div>

            {/* Quick Action Button to Simulate Immediate Reschedule Voice Note */}
            <div className="voice-controls-right">
              <button
                type="button"
                className="btn btn-primary btn-pill text-xs flex items-center gap-1.5 shadow-sm"
                onClick={() => handleExecuteCommand("Reschedule my meeting with Sarah to 4:00 PM and send her an email with the new timing", true)}
              >
                <Mic size={13} />
                <span>⚡ Voice Demo: Reschedule & Email Sarah</span>
              </button>
            </div>
          </div>

          {/* Live Transcript / Feedback Banner */}
          {(liveTranscript || isListening) && (
            <div className="voice-transcript-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>● Listening:</span>
                <span className="transcript-text">
                  {liveTranscript || 'Speak your request (e.g., "Reschedule Quarterly Strategy Review to 4 PM and email Sarah")...'}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-pill text-[11px] py-1 px-3"
                onClick={() => {
                  if (liveTranscript) {
                    setIsListening(false);
                    handleExecuteCommand(liveTranscript, true);
                  }
                }}
              >
                Send Voice Note →
              </button>
            </div>
          )}

          {voiceError && (
            <div style={{ fontSize: '11.5px', color: '#b91c1c', background: '#fef2f2', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
              {voiceError}
            </div>
          )}

          {/* Quick Voice Note Action Chips Row */}
          <div className="voice-chips-row">
            <span className="voice-chips-label">Quick Voice Commands:</span>
            <button
              type="button"
              className="voice-chip"
              onClick={() => handleExecuteCommand("Reschedule Quarterly Strategy Review to 4:00 PM and notify Sarah Jenkins via email", true)}
            >
              🎙️ Reschedule to 4 PM & Email Sarah
            </button>
            <button
              type="button"
              className="voice-chip"
              onClick={() => handleExecuteCommand("Sync Gmail and schedule all detected meetings to my calendar", true)}
            >
              🎙️ Sync Gmail & Calendar
            </button>
            <button
              type="button"
              className="voice-chip"
              onClick={() => handleExecuteCommand("Add high priority task: Prepare Q4 Strategy Deck by tomorrow", true)}
            >
              🎙️ Add High Priority Task
            </button>
            <button
              type="button"
              className="voice-chip"
              onClick={() => handleExecuteCommand("What meetings do I have scheduled on my calendar today?", true)}
            >
              🎙️ Check Today's Schedule
            </button>
          </div>
        </div>

        {/* 2. MESSAGES STREAM */}
        <div className="chat-messages-stream">
          {chatMessages.map((msg) => {
            const isAI = msg.sender === 'ai';

            return (
              <div key={msg.id} className={`chat-message-row ${isAI ? 'from-ai' : 'from-user'}`}>
                {isAI && (
                  <div className="ai-message-avatar">
                    <img src="/assets/ai-globe.jpg" alt="DailyEcho" />
                  </div>
                )}

                <div className={`message-bubble ${isAI ? 'ai-bubble' : 'user-bubble'}`}>
                  {/* Voice badge indicator if originated from speech */}
                  {msg.isVoice && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 700, opacity: 0.85, marginBottom: '4px' }}>
                      <Mic size={11} />
                      <span>Voice Note Command</span>
                    </div>
                  )}

                  <p className="message-text">{msg.text}</p>

                  {/* Autonomous Execution Receipt Card */}
                  {msg.executionReceipt && (
                    <div className="autonomous-action-card">
                      <div className="action-card-header">
                        <span className="action-card-title">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span>{msg.executionReceipt.title}</span>
                        </span>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0d9488', background: '#ecfdf5', padding: '2px 8px', borderRadius: '9999px' }}>
                          Verified Complete
                        </span>
                      </div>

                      <div className="action-steps-list">
                        {msg.executionReceipt.calendarStatus && (
                          <div className="action-step-item">
                            <div className="action-step-icon">
                              <CalIcon size={11} />
                            </div>
                            <div>
                              <strong>Google Calendar:</strong> {msg.executionReceipt.calendarStatus}
                            </div>
                          </div>
                        )}

                        {msg.executionReceipt.emailStatus && (
                          <div className="action-step-item">
                            <div className="action-step-icon">
                              <Mail size={11} />
                            </div>
                            <div>
                              <strong>Gmail Dispatch:</strong> {msg.executionReceipt.emailStatus}
                            </div>
                          </div>
                        )}

                        {msg.executionReceipt.taskStatus && (
                          <div className="action-step-item">
                            <div className="action-step-icon">
                              <CheckSquare size={11} />
                            </div>
                            <div>
                              <strong>Google Tasks:</strong> {msg.executionReceipt.taskStatus}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Voice Replay Bar */}
                      <div className="voice-replay-bar">
                        <span>Autonomous execution confirmed</span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-pill text-[11px] py-0.5 px-2.5 flex items-center gap-1"
                          onClick={() => speakVoiceResponse(msg.text)}
                          title="Replay Voice Note"
                        >
                          <Volume2 size={11} />
                          <span>Replay Audio</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Document preview attachment */}
                  {msg.sender === 'user' && msg.id === 'msg-user-1' && (
                    <div className="chat-doc-preview">
                      <FileText size={16} className="text-red-500" />
                      <div className="doc-meta">
                        <span className="doc-name">Quarterly_Strategy_Brief.pdf</span>
                        <span className="doc-size">1.4 MB</span>
                      </div>
                    </div>
                  )}

                  {/* Embedded Action Button for running workflow directly */}
                  {msg.hasRunAction && msg.suggestedPrompt && !msg.executionReceipt && (
                    <div className="bubble-action-box">
                      <div className="action-box-title">Ready to execute cross-app workflow:</div>
                      <button
                        type="button"
                        className="btn btn-primary btn-pill text-xs mt-2 flex items-center gap-1.5"
                        onClick={() => handleRunSuggestedWorkflow(msg.suggestedPrompt)}
                      >
                        <Play size={12} fill="currentColor" />
                        <span>Launch in AI Studio</span>
                      </button>
                    </div>
                  )}

                  <span className="message-timestamp">{msg.time}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 3. INPUT BAR (WORKS ON BOTH VOICE AND TYPING) */}
        <form onSubmit={handleFormSubmit} className="chat-input-bar">
          <div className="input-wrap">
            <button type="button" className="chat-attach-btn" title="Attach file or document">
              <Paperclip size={16} />
            </button>

            <input
              type="text"
              placeholder={isListening ? "Listening to your voice..." : "Type or speak: 'Reschedule to 4 PM and email Sarah', 'Add task', etc."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="chat-text-input"
            />

            {/* In-bar Voice Mic Button */}
            <button
              type="button"
              className={`chat-mic-btn ${isListening ? 'active' : ''}`}
              onClick={toggleListening}
              title={isListening ? 'Stop listening' : 'Start voice note recording'}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!inputVal.trim() && !isListening}
              title="Send message"
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
