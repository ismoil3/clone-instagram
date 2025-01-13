'use client'

import { useProfileStore } from "@/store/user-profile/user-profile"
import { Alert, Snackbar } from "@mui/material"

const AlertO = () => {
  const { isAlert, setCloseAlert, AlertMessage } = useProfileStore()
  return (
    <Snackbar
      open={isAlert}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={setCloseAlert}
    >
      <Alert onClose={setCloseAlert} severity='success' sx={{ width: '100%' }}>
        {AlertMessage}
      </Alert>
    </Snackbar>
  )
}

export default AlertO
