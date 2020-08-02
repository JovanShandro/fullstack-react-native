export default function getInitials(fullname: string) {
  const match = fullname.match(/(\w)?\w*\s*(\w)?/);
  return match ? match.slice(1).join("") : "";
}
