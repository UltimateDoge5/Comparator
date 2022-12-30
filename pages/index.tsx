import Head from "next/head";
import Image from "next/image";

export default function Home() {
	return (
		<>
      <Head>
        <title>Compare any CPU you want</title>
        <meta name="description" content="Comparator lets you compare CPUs and GPUs in an instant!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
	      {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>
			<div className="bg-gradient-to-br from-sky-700 via-transparent -top-8 -left-20 w-full h-full absolute -z-10" />
			<main className="pt-12 flex flex-col items-center gap-8">
				<h1 className="text-white text-6xl font-semibold">Compare CPUs</h1>

				<section className="grid grid-cols-2 divide-x">
					<div className="flex flex-col justify-center items-center">
						<select className="bg-gray-200 rounded-md p-2">
							<option> Intel</option>
							<option> AMD </option>
						</select>
					</div>
					<div className="flex flex-col justify-center items-center">
						<select className="bg-gray-200 rounded-md p-2">
							<option> Intel</option>
							<option>AMD</option>
						</select>
					</div>
				</section>
			</main>
    </>
	);
}
