export default function Home() {

    return (
        <div className="w-screen min-h-screen flex flex-col hidden-scrollbar relative">

            {/* Couleur de fond */}
            <div className="absolute top-0 inset-0 -z-10 bg-red-900"></div>

            {/* Image de fond */}
            {/* <div className="absolute top-22 inset-0 -z-10 opacity-30">
                <Image src="/fond_gta_artwork.jpg" alt="Image de fond" layout="fill" objectFit="cover" quality={100} priority/>
            </div> */}

            <main className="flex flex-col w-full items-center flex-grow">
                <h2 className="text-4xl font-bold text-custom-b_yellow p-6 text-center">Avis client</h2>
            </main>
        </div>
    );
}