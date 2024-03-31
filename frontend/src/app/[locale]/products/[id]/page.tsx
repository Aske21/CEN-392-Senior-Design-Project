export default function Page({ params }: { params: { id: string } }) {
  return <div>Product: {params.id}</div>;
}
