import React from 'react';

const Notificacion = ({ message, type }) => {
  if (!message) return null

  const styles = {
    success: { backgroundColor: 'green', color: 'white' },
    error: { backgroundColor: 'red', color: 'white' }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      borderRadius: '5px',
      zIndex: 9999,
      ...styles[type]
    }}>
      {message}
    </div>
  )
}

export default Notificacion