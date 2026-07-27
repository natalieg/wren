export const formatTime = (minutes) =>
    minutes >= 60 ? `${Math.floor(minutes / 60)}h${minutes % 60 ? minutes % 60 + 'm' : ''}` : `${minutes}m`
