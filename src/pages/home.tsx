import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://apiv3.apifootball.com/?action=get_events";
const today = new Date().toISOString().split("T")[0];


type Match = {
	// adjust optional fields/types to match the API
	match_id?: string;
	league_name: string;
	match_hometeam_name: string;
	match_awayteam_name: string;
	match_time: string | number;
	match_status: string;
	match_hometeam_score: string;
	match_awayteam_score: string;
};

export default function Home() {
	const [data, setData] = useState<Match[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(
					`${BASE_URL}&match_live=1&from=${today}&to=${today}&APIkey=${API_KEY}`,
					{
						method: "GET",
					}
				);

				if (!res.ok) {
					setError("Network response was not ok");
				}
				setData(await res.json());
			} catch (err: unknown) {
				setError(err instanceof Error ? err.message : String(err)); // setError("Error fetching data");
			} finally {
				setLoading(false);
			}
		};
		console.log(data);
		fetchData();
		const interval = setInterval(fetchData, 20000);

		return () => clearInterval(interval); //
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="min-h-screen p-4 flex flex-col items-center gap-6 max-w-3xl w-full mx-auto">
			<h4>Live Football Scores</h4>
			<div className="flex flex-col gap-4 w-full  items-center">
				{data.length === 0 ? (
					<p>No live matches right now</p>
				) : (
					data.map((match, i) => (
						<ul key={i} className="w-full">
							<li className="text-center bg-zinc-800 w-full flex justify-center py-2">
								{match.league_name}
							</li>
							<li className="text-center py-3 border border-zinc-800 w-full">
								{match.match_hometeam_name}{" "}
								<span className="font-bold">{match.match_hometeam_score}</span> -{" "}
								<span className="font-bold">{match.match_awayteam_score}</span>{" "}
								{match.match_awayteam_name} - {match.match_time}' -{" "}
								{match.match_status}
							</li>
						</ul>
					))
				)}
			</div>
		</div>
	);
}
