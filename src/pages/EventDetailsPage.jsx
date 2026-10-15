// function EventDetailsPage() {
//   return <h1>EventDetails</h1>
// }
import { useParams } from 'react-router-dom'

function EventDetailsPage() {
  const { id } = useParams()
  return <h1>Event Details: {id}</h1>
}
export default EventDetailsPage