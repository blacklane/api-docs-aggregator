import type React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import clsx from "clsx"; // Import clsx for conditional classes
import { useRef, useEffect, useState } from "react";

// Define the type for a single API item
interface ApiItem {
	name: string;
	url: string;
}

// Define the props for the Sidebar component
interface SidebarProps {
	apis: ApiItem[];
	onApiSelect: (url: string, name: string) => void;
	selectedApiUrl: string | null;
	currentTheme?: string; // Optional theme prop to force re-renders
}

const Sidebar: React.FC<SidebarProps> = ({
	apis,
	onApiSelect,
	selectedApiUrl,
	currentTheme, // Add this prop
}) => {
	const [indicatorStyle, setIndicatorStyle] = useState({});
	const itemRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

	useEffect(() => {
		if (selectedApiUrl && itemRefs.current.has(selectedApiUrl)) {
			const selectedElement = itemRefs.current.get(selectedApiUrl);
			if (selectedElement) {
				setIndicatorStyle({
					top: selectedElement.offsetTop,
					height: selectedElement.offsetHeight,
					opacity: 1
				});
			}
		} else {
			setIndicatorStyle({ opacity: 0 });
		}
	}, [selectedApiUrl]);

	// Function to set ref
	const setItemRef = (url: string, element: HTMLButtonElement | null) => {
		if (element) {
			itemRefs.current.set(url, element);
		}
	};

	return (
		<aside className="w-72 h-screen flex flex-col bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 overflow-hidden shrink-0" data-shade="925">
			<ScrollArea.Root className="flex-grow overflow-hidden">
				<ScrollArea.Viewport className="w-full h-full">
					{apis.length > 0 ? (
						<ul className="list-none p-0 m-0 relative">
							<div 
								className="absolute left-0 w-1 bg-purple-500 rounded-r transition-all duration-300 ease-in-out z-0 shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
								style={indicatorStyle}
							/>
							{apis.map((api) => (
								<li key={api.url}>
									<button
										type="button"
										ref={(el) => setItemRef(api.url, el)}
										className={clsx(
											"w-full text-left py-3 px-4 border-l-4 text-sm transition-all duration-300 ease-in-out focus:outline-none relative overflow-hidden group",
											selectedApiUrl === api.url 
												? "border-l-transparent bg-zinc-200 text-zinc-900 font-medium dark:bg-zinc-700 dark:text-zinc-100 translate-x-0.5"
												: "border-l-transparent text-gray-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750 dark:hover:text-zinc-900",
										)}
										onClick={() => onApiSelect(api.url, api.name)}
									>
										<span className={clsx(
											"relative z-10 transition-transform duration-300",
											selectedApiUrl === api.url ? "translate-x-1" : ""
										)}>
											{api.name}
										</span>
										{selectedApiUrl === api.url && (
											<span className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent transition-all duration-500 opacity-100" />
										)}
									</button>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500 dark:text-zinc-400 p-2 text-center">No APIs configured.</p>
					)}
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-zinc-700 transition hover:bg-gray-200 dark:hover:bg-zinc-600 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
					orientation="vertical"
				>
					<ScrollArea.Thumb className="flex-1 bg-gray-300 dark:bg-zinc-500 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner className="bg-gray-200 dark:bg-zinc-600" />
			</ScrollArea.Root>
		</aside>
	);
};

export default Sidebar;
