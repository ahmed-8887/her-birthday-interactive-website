import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, Sparkles, AlertCircle, ArrowLeft, Mic, Edit3, Square, RotateCcw, Orbit } from 'lucide-react';
import { StarField } from '../components/StarField';
import { textFadeUp } from '../animations/variants';
import { trackMessageSubmitted, getSessionId } from '../services/tracker';

export const MessageFormSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'voice'

  // Text State
  const [message, setMessage] = useState('');

  // Audio Recording State
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioTimer, setAudioTimer] = useState(0);
  const audioMediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioTimerIntervalRef = useRef(null);

  // Form Status State
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  // Clean up audio timer on unmount
  useEffect(() => {
    return () => {
      clearInterval(audioTimerIntervalRef.current);
    };
  }, []);

  // Switch Tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setValidationError('');
    setServerError('');
  };

  // ----------------------------------------------------
  // Audio Recording Functions
  // ----------------------------------------------------
  const startAudioRecording = async () => {
    setValidationError('');
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioTimer(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioMediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecordingAudio(true);

      audioTimerIntervalRef.current = setInterval(() => {
        setAudioTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Audio access error:', err);
      setValidationError('Microphone access was denied. Please allow microphone permission to record audio.');
    }
  };

  const stopAudioRecording = () => {
    if (audioMediaRecorderRef.current && isRecordingAudio) {
      audioMediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      clearInterval(audioTimerIntervalRef.current);
    }
  };

  const retakeAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioTimer(0);
    setValidationError('');
  };

  // Format seconds to MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert Blob to Base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // ----------------------------------------------------
  // Form Submission
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setServerError('');

    let payload = {
      type: activeTab,
      sessionId: getSessionId(),
    };

    if (activeTab === 'text') {
      const trimmed = message.trim();
      if (!trimmed) {
        setValidationError('Please write a little message first 💌');
        return;
      }
      if (trimmed.length > 3000) {
        setValidationError('Message exceeds the maximum limit of 3000 characters.');
        return;
      }
      payload.message = trimmed;
    } else if (activeTab === 'voice') {
      if (!audioBlob) {
        setValidationError('Please record a voice note before sending 🎙️');
        return;
      }
      const base64Audio = await blobToBase64(audioBlob);
      payload.mediaData = base64Audio;
      payload.mimeType = 'audio/webm';
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        trackMessageSubmitted(activeTab);
      } else {
        setServerError(data.error || 'Something went wrong while sending your message. Please try again.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setServerError('Something went wrong while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToExperience = (e) => {
    e.preventDefault();
    navigate('/birthday');
  };

  const handleGoToUniverse = (e) => {
    e.preventDefault();
    navigate('/universe');
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 px-4 sm:px-6 z-10 select-none overflow-hidden bg-[#0B0B0F]">
      {/* Background Star Canvas */}
      <StarField isAccelerated={isSubmitted} />

      {/* Main Content Area */}
      <div className="my-auto w-full max-w-xl mx-auto z-20 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {/* 1. Form State */}
          {!isSubmitted ? (
            <motion.div
              key="message-form"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              variants={textFadeUp}
              className="w-full flex flex-col items-center text-center"
            >
              {/* Header Title */}
              <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal italic tracking-wide mb-2 text-glow-white">
                One Last Thing...
              </h1>

              {/* Subheading */}
              <p className="font-sans text-xs sm:text-sm text-[#9A9AA5] font-light tracking-wider uppercase mb-6">
                Before you go, leave me a little message 💌
              </p>

              {/* Message Format Mode Tabs (Write / Voice Note) */}
              <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => handleTabChange('text')}
                  className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2 rounded-full font-sans text-xs font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    activeTab === 'text'
                      ? 'bg-[#FF4F81] text-white shadow-glow-pink'
                      : 'text-[#9A9AA5] hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Write</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('voice')}
                  className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2 rounded-full font-sans text-xs font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    activeTab === 'voice'
                      ? 'bg-[#FF4F81] text-white shadow-glow-pink'
                      : 'text-[#9A9AA5] hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice Note</span>
                </button>
              </div>

              {/* Form Card Container */}
              <form
                onSubmit={handleSubmit}
                className="w-full bg-[#12121A]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-glow-pink flex flex-col gap-6 text-left backdrop-blur-md"
              >
                {/* 1. TEXT MODE */}
                {activeTab === 'text' && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="visitor-message" className="font-sans text-xs font-medium tracking-widest text-[#FF4F81] uppercase flex items-center justify-between">
                      <span>Your Message</span>
                      <span className="text-[10px] text-[#FF4F81] font-normal">*required</span>
                    </label>
                    <textarea
                      id="visitor-message"
                      rows={6}
                      maxLength={3000}
                      required
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (validationError) setValidationError('');
                        if (serverError) setServerError('');
                      }}
                      placeholder="Write whatever is in your heart..."
                      className="w-full px-4 py-3.5 rounded-xl bg-[#0B0B0F]/80 border border-white/15 text-white placeholder:text-[#9A9AA5]/60 font-sans text-sm sm:text-base leading-relaxed focus:outline-none focus:border-[#FF4F81] focus:ring-1 focus:ring-[#FF4F81] transition-all duration-200 resize-y min-h-[160px] max-h-[340px]"
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#9A9AA5]">Supports multiple lines</span>
                      <span className={message.length > 2800 ? 'text-[#E63946]' : 'text-[#9A9AA5]'}>
                        {message.length} / 3000
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. VOICE NOTE MODE */}
                {activeTab === 'voice' && (
                  <div className="flex flex-col items-center justify-center py-6 px-4 rounded-xl bg-[#0B0B0F]/80 border border-white/10 gap-5 text-center">
                    <div className="font-sans text-xs font-medium tracking-widest text-[#FF4F81] uppercase flex items-center justify-between w-full">
                      <span>Voice Message Recorder</span>
                      <span className="text-[10px] text-[#FF4F81] font-normal">*required</span>
                    </div>

                    {/* Timer Display */}
                    <div className="font-mono text-2xl sm:text-3xl text-white tracking-widest">
                      {formatTimer(audioTimer)}
                    </div>

                    {/* Audio Recorder Controls */}
                    {!audioUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        {!isRecordingAudio ? (
                          <button
                            type="button"
                            onClick={startAudioRecording}
                            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#E63946] hover:bg-[#FF4F81] text-white font-sans text-xs font-medium tracking-widest uppercase transition-all duration-200 shadow-glow-red cursor-pointer"
                          >
                            <Mic className="w-4 h-4" />
                            <span>Start Recording</span>
                          </button>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-xs font-mono text-[#FF4F81] animate-pulse">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />
                              <span>RECORDING IN PROGRESS...</span>
                            </div>
                            <button
                              type="button"
                              onClick={stopAudioRecording}
                              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#E63946] text-white font-sans text-xs font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-200 cursor-pointer"
                            >
                              <Square className="w-4 h-4" />
                              <span>Stop Recording</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Audio Playback & Retake */
                      <div className="w-full flex flex-col items-center gap-4">
                        <audio src={audioUrl} controls className="w-full max-w-sm rounded-lg" />
                        <button
                          type="button"
                          onClick={retakeAudio}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-[#9A9AA5] hover:text-white text-xs font-sans tracking-wider uppercase transition-colors duration-200 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retake Recording</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Inline Validation / Server Error Messages */}
                {(validationError || serverError) && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-[#E63946]/10 border border-[#E63946]/40 flex items-center gap-2 text-xs text-white"
                  >
                    <AlertCircle className="w-4 h-4 text-[#E63946] shrink-0" />
                    <span>{validationError || serverError}</span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isRecordingAudio}
                  whileHover={!isSubmitting ? {
                    scale: 1.02,
                    borderColor: 'rgba(255, 79, 129, 0.8)',
                    boxShadow: '0 0 25px rgba(255, 79, 129, 0.45)',
                  } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className={`w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-[#FF4F81]/50 bg-[#E63946] text-white font-sans text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 min-h-[50px] shadow-glow-red focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F81] ${
                    isSubmitting || isRecordingAudio ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 text-white animate-spin" />
                      <span>Sending your message... 💌</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>
                        {activeTab === 'voice'
                          ? 'SEND MY VOICE NOTE 🎙️'
                          : 'SEND MY MESSAGE 💌'}
                      </span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            /* 2. Message Sent Success State */
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="w-full flex flex-col items-center text-center max-w-md mx-auto"
            >
              {/* Success Badge Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.25, 1] }}
                transition={{ duration: 0.8 }}
                className="p-4 rounded-full bg-white/5 border border-[#FF4F81]/40 shadow-glow-pink mb-6"
              >
                <Heart className="w-10 h-10 text-[#FF4F81] fill-[#FF4F81] animate-pulse" />
              </motion.div>

              {/* Success Heading */}
              <h1 className="font-serif text-4xl sm:text-5xl text-white font-normal italic tracking-wide mb-4 text-glow-pink">
                Message Delivered 💌
              </h1>

              {/* Success Text */}
              <p className="font-sans text-sm sm:text-base text-[#9A9AA5] font-light leading-relaxed mb-8 max-w-sm">
                Your words have safely reached me. Thank you for leaving a little piece of your heart here.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <motion.button
                  onClick={handleBackToExperience}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/25 bg-[#0B0B0F]/80 text-white font-sans text-xs font-medium tracking-widest uppercase transition-all duration-300 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#FF4F81]" />
                  <span>Celebration</span>
                </motion.button>

                <motion.button
                  onClick={handleGoToUniverse}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#FF4F81]/50 bg-[#E63946] text-white font-sans text-xs font-medium tracking-widest uppercase transition-all duration-300 shadow-glow-red cursor-pointer"
                >
                  <Orbit className="w-4 h-4 text-white" />
                  <span>Our Universe</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
