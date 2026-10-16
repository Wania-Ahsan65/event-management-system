import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, clearAuthError } from '../features/auth/authSlice'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) dispatch(clearAuthError())
  }

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.'
    if (!emailRegex.test(form.email)) e.email = 'Enter a valid email address.'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.'
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) navigate('/')
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h1>Create account</h1>
      {error && <p className="form-error">{error}</p>}

      <label>Name</label>
      <input name="name" value={form.name} onChange={handleChange} />
      {errors.name && <span className="field-error">{errors.name}</span>}

      <label>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} />
      {errors.email && <span className="field-error">{errors.email}</span>}

      <label>Password</label>
      <input name="password" type="password" value={form.password} onChange={handleChange} />
      {errors.password && <span className="field-error">{errors.password}</span>}

      <label>Confirm password</label>
      <input name="confirm" type="password" value={form.confirm} onChange={handleChange} />
      {errors.confirm && <span className="field-error">{errors.confirm}</span>}

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Creating...' : 'Register'}
      </button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  )
}

export default RegisterPage