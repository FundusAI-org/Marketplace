export default function Order({ params }: { params: { slug: string } }) {
  return <div>Order: {params.slug}</div>;
}
