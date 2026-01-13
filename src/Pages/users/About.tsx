import UserLayout from '../../components/layouts/UserLayout'
export default function About() {
  return (
    <UserLayout>
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="text-gray-600">
          We provide comfortable and affordable rooms for students and visitors.
        </p>
      </section>
    </UserLayout>
  );
}
