export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-6">
        <section className="text-center my-12">
          <h2 className="text-4xl font-bold mb-4">Bienvenido a WEB3EDU</h2>
          <p className="text-lg mb-8">La plataforma educativa del futuro, utilizando la innavadora tecnología blockchain.</p>
          <a href="#funcionalidades" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Descubre más</a>
        </section>

        {/* funcionalidades */}
        <section id="funcionalidades" className="my-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Funcionalidades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h4 className="text-2xl font-bold mb-2">Gestión de Alumnos</h4>
              <p>Consulta y administra la información de los alumnos de manera segura y eficiente.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h4 className="text-2xl font-bold mb-2">Gestión de Asignaturas</h4>
              <p>Accede a la información de las asignaturas y sus profesores</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h4 className="text-2xl font-bold mb-2">Gestión de Profesores</h4>
              <p>Consulta la información de los profesores registrados.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h4 className="text-2xl font-bold mb-2">Matrículas</h4>
              <p>Gestión de matrículas y pago de forma segura y transparente usando tecnología blockchain.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h4 className="text-2xl font-bold mb-2">Certificados NFT</h4>
              <p>Emite certificados en formato NFT para asegurar su autenticidad.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h4 className="text-2xl font-bold mb-2">Integración con Metamask</h4>
              <p>Permite conectarnos con nuestra cartera de Metamask de manera sencilla.</p>
            </div>
          </div>
        </section>

        {/* Acerca de nosotros */}
        <section id="about" className="my-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Acerca de Nosotros</h3>
          <p className="text-center">WEB3EDU es una plataforma innovadora que utiliza tecnología blockchain para su funcionamiento.</p>
        </section>

        {/* Contacto */}
        <section id="contact" className="my-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Contacto</h3>
          <p className="text-center">¿Tienes preguntas? No dudes en <a href="mailto:jortin8@alu.ucam.edu" className="text-blue-500 hover:underline">contactarnos</a>.</p>
        </section>
      </main>
    </div>
  );
}
