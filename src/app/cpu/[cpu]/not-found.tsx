import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";

export default function NotFound() {
	return (
		<>
			<Navbar />
			<main>
                <h2>CPU not found</h2>
                <p>Could not find requested resource</p>
			</main>
            <Footer />
		</>
	);
}