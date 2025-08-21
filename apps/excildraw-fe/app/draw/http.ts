import axios from "axios";

export async function getShapes(roomid: string) {
  const response = await axios.get(
    `http://localhost:3001/api/v1/chats/${roomid}`
  );
  const messages = response.data.messages;
  console.log(messages, "from backend");

  const shapes = messages.map((x:{message:string}) => {
    const parsed = JSON.parse(x.message)
    const key = Object.keys(parsed)[0]
    return parsed[key]
  })
  .filter(Boolean) 
  return shapes;
}