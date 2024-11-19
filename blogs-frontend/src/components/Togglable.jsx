import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <button onClick={toggleVisibility}>
        {visible ? 'Cancel' : 'Create new blog'}
      </button>
      {visible && (
        <div>
          {props.children}
        </div>
      )}
    </div>
  )
}

export default Togglable