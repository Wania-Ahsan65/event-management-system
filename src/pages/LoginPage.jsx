import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation ,useNavigate } from 'react-router-dom'
import { loginUser, clearAuthError } from '../features/auth/authSlice'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error } = useSelector((state) => state.auth)
  const from = location.state?.from?.pathname || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) dispatch(clearAuthError())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = {}
    if (!form.email.trim()) v.email = 'Email is required.'
    if (!form.password) v.password = 'Password is required.'
    setErrors(v)
    if (Object.keys(v).length > 0) return

    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) navigate(from, { replace: true })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h1>Login</h1>
      {error && <p className="form-error">{error}</p>}

      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} />
      {errors.email && <span className="field-error">{errors.email}</span>}

      <label>Password</label>
      <input name="password" type="password" value={form.password} onChange={handleChange} />
      {errors.password && <span className="field-error">{errors.password}</span>}

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Logging in...' : 'Login'}
      </button>
      <p>No account? <Link to="/register">Register</Link></p>
    </form>
  )
}

export default LoginPage