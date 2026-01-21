"use client";

import Image from "next/image";
import { Users, PlusCircle, Search, Compass, Globe, Lock, ChevronDown, ArrowUpDown, X } from "lucide-react";
import MainLayout from "@/app/main/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthPromptModal } from "@/components/ui/AuthPromptModal";

const mockGroups = [
	{
		id: "g1",
		name: "Cộng Đồng Front-end Việt Nam",
		description: "Nơi thảo luận, chia sẻ kiến thức về HTML, CSS, JS, React, Vue, Angular và các công nghệ web mới nhất.",
		members: 45200,
		cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",

		privacy: "Public",
		friends: 12,
		createdAt: "2023-12-01",
	},
	{
		id: "g2",
		name: "Nghiện Decor - Trang Trí Nhà Cửa",
		description: "Chia sẻ ý tưởng decor phòng, nhà cửa, review nội thất và không gian sống chill.",
		members: 128500,
		cover: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60",

		privacy: "Public",
		friends: 8,
		createdAt: "2023-11-20",
	},
	{
		id: "g3",
		name: "Hội Review Đồ Ăn Có Tâm",
		description: "Review chân thực các quán ăn, món ngon vỉa hè đến sang chảnh. Không nhận booking.",
		members: 89000,
		cover: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60",

		privacy: "Private",
		friends: 24,
		createdAt: "2024-01-15",
	},
	{
		id: "g4",
		name: "Gen Z Tập Làm Người Lớn",
		description: "Góc tâm sự, chia sẻ kỹ năng sống, tài chính cá nhân và chuyện đi làm của Gen Z.",
		members: 32100,
		cover: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=60",

		privacy: "Public",
		friends: 5,
		createdAt: "2023-10-05",
	},
	{
		id: "g5",
		name: "Tuyển dụng IT - Việc làm Tech",
		description: "Cập nhật job IT xịn, lương cao, remote/hybrid cho anh em developer.",
		members: 15600,
		cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",

		privacy: "Public",
		friends: 0,
		createdAt: "2024-02-01",
	},
	{
		id: "g6",
		name: "Hội Yêu Mèo (Vietnam Cat Lovers)",
		description: "Chia sẻ khoảnh khắc cute của hoàng thượng, kinh nghiệm chăm sóc boss.",
		members: 210500,
		cover: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=60",

		privacy: "Public",
		friends: 42,
		createdAt: "2023-09-12",
	},
];

function formatNumber(n: number) {
	if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
	if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
	return String(n);
}

const ITEMS_PER_PAGE = 4;

export default function GroupsPage() {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [query, setQuery] = useState("");
	const [activeTab, setActiveTab] = useState("discover"); // discover | my-groups
	const [isLoading, setIsLoading] = useState(true);
	const [groups, setGroups] = useState<typeof mockGroups>([]);
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
	const [sortOption, setSortOption] = useState("newest");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [newGroupData, setNewGroupData] = useState({
		name: "",
		description: "",
		privacy: "Public",
	});

	// Fake API Call
	useEffect(() => {
		const fetchGroups = async () => {
			setIsLoading(true);
			// Giả lập delay mạng 1.5s để thấy hiệu ứng loading
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Giả lập dữ liệu trả về theo tab
			const data = activeTab === "my-groups"
				? mockGroups.filter((_, i) => [0, 2, 5].includes(i)) // Giả định đã tham gia nhóm 1, 3, 6
				: mockGroups;

			setGroups(data);
			setIsLoading(false);
			setVisibleCount(ITEMS_PER_PAGE); // Reset về trang đầu khi chuyển tab
			setSortOption("newest");
		};

		fetchGroups();
	}, [activeTab]);

	const filteredGroups = groups.filter((g) => {
		return `${g.name} ${g.description}`.toLowerCase().includes(query.toLowerCase());
	}).sort((a, b) => {
		if (sortOption === "most-members") return b.members - a.members;
		if (sortOption === "a-z") return a.name.localeCompare(b.name);
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	const displayedGroups = filteredGroups.slice(0, visibleCount);

	const handleCreateGroup = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}
		// Mock adding group
		const newGroup = {
			id: `new_${Date.now()}`,
			name: newGroupData.name,
			description: newGroupData.description,
			members: 1,
			cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60", // Default cover for new groups

			privacy: newGroupData.privacy,
			friends: 0,
			createdAt: new Date().toISOString(),
		};

		setGroups([newGroup, ...groups]);
		setIsCreateModalOpen(false);
		setNewGroupData({ name: "", description: "", privacy: "Public" });
	};

	return (
		<MainLayout>
			<div className="mx-auto max-w-5xl py-2">
				{/* Header Section */}
				<div className="mb-6 flex flex-col gap-6">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-[#f9622e]">
								<Users className="h-5 w-5" />
							</span>
							<h2 className="text-sm font-bold uppercase tracking-wider text-[#f9622e]">Cộng đồng</h2>
						</div>
						<h1 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
							Khám phá <span className="text-transparent bg-clip-text bg-linear-to-r from-[#f9622e] to-[#ff9f43]">Cộng đồng</span>
						</h1>
						<p className="mt-3 text-base text-gray-500 max-w-2xl">
							Kết nối với những người có cùng đam mê. Tham gia các cuộc thảo luận, chia sẻ kiến thức và mở rộng mạng lưới của bạn.
						</p>
					</div>

					<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
						<div className="relative flex-1 max-w-lg">
							<span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Search className="h-5 w-5 text-gray-400" />
							</span>
							<input
								value={query}
								onChange={(e) => {
									setQuery(e.target.value);
									setVisibleCount(ITEMS_PER_PAGE);
								}}
								placeholder="Tìm kiếm nhóm, chủ đề..."
								className="w-full rounded-xl border border-transparent bg-gray-100 py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:border-[#f9622e] focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 sm:text-sm sm:leading-6"
							/>
						</div>
						<button onClick={() => setIsCreateModalOpen(true)} className="group flex items-center cursor-pointer justify-center gap-2 rounded-xl bg-[#f9622e] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-[#ff7240] hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0">
							<PlusCircle className="h-4 w-4" />
							<span>Tạo nhóm mới</span>
						</button>
					</div>
				</div>

				{/* Tabs Navigation & Filter */}
				<div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div className="flex items-center gap-2 rounded-xl bg-gray-100/50 p-1.5 w-fit">
						<button
							onClick={() => setActiveTab("discover")}
							className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300 ${activeTab === "discover"
								? "bg-white text-[#f9622e] shadow-sm ring-1 ring-black/5"
								: "text-gray-500 hover:bg-gray-200/50 cursor-pointer hover:text-gray-700"
								}`}
						>
							<Compass className={`h-4 w-4 ${activeTab === "discover" ? "animate-pulse" : ""}`} />
							Khám phá
						</button>
						<button
							onClick={() => setActiveTab("my-groups")}
							className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300 ${activeTab === "my-groups"
								? "bg-white text-[#f9622e] shadow-sm ring-1 ring-black/5"
								: "text-gray-500 cursor-pointer hover:bg-gray-200/50 hover:text-gray-700"
								}`}
						>
							<Users className="h-4 w-4" />
							Nhóm của tôi
						</button>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						{/* Sort Dropdown */}
						<div className="relative">
							<ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
							<select
								value={sortOption}
								onChange={(e) => setSortOption(e.target.value)}
								className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-10 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 focus:border-[#f9622e] focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 cursor-pointer sm:w-auto"
							>
								<option value="newest">Mới nhất</option>
								<option value="most-members">Nhiều thành viên nhất</option>
								<option value="a-z">Nhóm A-Z</option>
							</select>
							<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						</div>
					</div>
				</div>

				{/* Content Grid */}
				<div className="min-h-100">
					{isLoading ? (
						// Skeleton Loading State
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{[1, 2, 3, 4].map((n) => (
								<div key={n} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
									<div className="h-36 w-full animate-pulse bg-gray-200" />
									<div className="flex flex-1 flex-col p-4">
										<div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
										<div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
										<div className="mb-4 h-10 w-full animate-pulse rounded bg-gray-200" />
										<div className="mt-auto h-10 w-full animate-pulse rounded-xl bg-gray-200" />
									</div>
								</div>
							))}
						</div>
					) : filteredGroups.length === 0 ? (
						<div className="relative overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
							{/* Background Pattern - Blurred Group Cards */}
							<div className="absolute inset-0 grid grid-cols-1 gap-6 p-6 opacity-40 blur-[5px] lg:grid-cols-2 pointer-events-none select-none overflow-hidden">
								{mockGroups.slice(0, 4).map((_, i) => (
									<div key={`bg-mock-${i}`} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
										<div className="h-36 w-full bg-gray-200" />
										<div className="flex flex-1 flex-col p-4">
											<div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
											<div className="mb-4 h-4 w-1/2 rounded bg-gray-200" />
											<div className="mt-auto h-10 w-full rounded-xl bg-gray-200" />
										</div>
									</div>
								))}
							</div>

							{/* Foreground Content */}
							<div className="relative z-10 flex flex-col items-center justify-center py-24 text-center backdrop-blur-[1px]">
								<div className="mb-4 rounded-full bg-white p-4 shadow-lg ring-1 ring-gray-100 animate-bounce">
									<div className="rounded-full bg-orange-50 p-4">
										<Search className="h-8 w-8 text-[#f9622e]" />
									</div>
								</div>
								<h3 className="text-2xl font-black text-gray-900">Không tìm thấy kết quả</h3>
								<p className="mt-2 text-gray-500 max-w-md mx-auto px-4">
									Rất tiếc! Không thể tìm thấy nhóm nào phù hợp với từ khóa <span className="font-bold text-gray-900">&quot;{query}&quot;</span>
								</p>
								<button
									onClick={() => {
										setQuery("");
										setSortOption("newest");
										setVisibleCount(ITEMS_PER_PAGE);
									}}
									className="mt-8 flex items-center cursor-pointer gap-2 rounded-xl bg-[#f9622e] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-[#ff7240] hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0"
								>
									<X className="h-4 w-4" />
									Xóa bộ lọc tìm kiếm
								</button>
							</div>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								{displayedGroups.map((g, index) => (
									<div
										key={g.id}
										style={{ animationDelay: `${index * 100}ms` }}
										className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-8"
									>
										{/* Cover Image Area */}
										<div className="relative h-36 w-full overflow-hidden bg-gray-100">
											{g.cover && (
												<Image
													src={g.cover}
													alt={g.name}
													fill
													className="object-cover transition-transform duration-500 group-hover:scale-105"
												/>
											)}

										</div>

										{/* Content Area */}
										<div className="flex flex-1 flex-col p-4">
											<h3 className="mb-1 line-clamp-1 text-lg font-bold text-gray-900 group-hover:text-[#f9622e] transition-colors">
												{g.name}
											</h3>

											<div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
												<span className="flex items-center gap-1">
													{g.privacy === "Public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
													{g.privacy === "Public" ? "Công khai" : "Riêng tư"}
												</span>
												<span>•</span>
												<span className="font-medium">{formatNumber(g.members)} thành viên</span>
											</div>

											<p className="mb-4 line-clamp-2 text-sm text-gray-500 flex-1">
												{g.description}
											</p>

											{g.friends > 0 && (
												<div className="mb-4 flex items-center gap-2">
													<div className="flex -space-x-2">
														<div className="h-5 w-5 rounded-full ring-2 ring-white bg-gray-200" />
														<div className="h-5 w-5 rounded-full ring-2 ring-white bg-gray-300" />
													</div>
													<span className="text-xs text-gray-500">
														<span className="font-semibold text-gray-700">{g.friends} bạn bè</span> đã tham gia
													</span>
												</div>
											)}

											<div className="mt-auto">
												<button 
													onClick={() => {
														if (!isAuthenticated) {
															setShowAuthModal(true);
														}
													}}
													className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-[#f9622e]/10 hover:text-[#f9622e] active:scale-95"
												>
													Tham gia nhóm
												</button>
											</div>
										</div>
									</div>
								))}
							</div>

							{visibleCount < filteredGroups.length && (
								<div className="mt-8 flex justify-center">
									<button
										onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
										className="flex items-center cursor-pointer gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-600 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:text-[#f9622e] hover:ring-[#f9622e]/30 active:scale-95"
									>
										Xem thêm <ChevronDown className="h-4 w-4" />
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{/* Create Group Modal */}
			{isCreateModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
						<div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
							<h3 className="text-lg font-bold text-gray-900">Tạo nhóm mới</h3>
							<button onClick={() => setIsCreateModalOpen(false)} className="rounded-full cursor-pointer p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors">
								<X className="h-5 w-5" />
							</button>
						</div>

						<form onSubmit={handleCreateGroup} className="p-6">
							<div className="space-y-5">
								<div>
									<label className="mb-1.5 block text-sm font-bold text-gray-700">Tên nhóm</label>
									<input
										required
										value={newGroupData.name}
										onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
										placeholder="VD: Cộng đồng React Việt Nam"
										className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#f9622e] focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 transition-all"
									/>
								</div>

								<div>
									<label className="mb-1.5 block text-sm font-bold text-gray-700">Mô tả</label>
									<textarea
										required
										rows={3}
										value={newGroupData.description}
										onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
										placeholder="Mô tả mục đích hoạt động của nhóm..."
										className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#f9622e] focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 transition-all"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm font-bold text-gray-700">Quyền riêng tư</label>
									<div className="grid grid-cols-2 gap-3">
										<button
											type="button"
											onClick={() => setNewGroupData({ ...newGroupData, privacy: "Public" })}
											className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-all ${newGroupData.privacy === "Public"
												? "border-[#f9622e] bg-orange-50 text-[#f9622e] ring-1 ring-[#f9622e]"
												: "border-gray-200 bg-white cursor-pointer text-gray-500 hover:border-gray-300 hover:bg-gray-50"
												}`}
										>
											<Globe className="h-5 w-5" />
											Công khai
										</button>
										<button
											type="button"
											onClick={() => setNewGroupData({ ...newGroupData, privacy: "Private" })}
											className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-all ${newGroupData.privacy === "Private"
												? "border-[#f9622e] bg-orange-50 text-[#f9622e] ring-1 ring-[#f9622e]"
												: "border-gray-200 bg-white cursor-pointer text-gray-500 hover:border-gray-300 hover:bg-gray-50"
												}`}
										>
											<Lock className="h-5 w-5" />
											Riêng tư
										</button>
									</div>
									<p className="mt-2 text-xs text-gray-500">
										{newGroupData.privacy === "Public"
											? "Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng."
											: "Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng."}
									</p>
								</div>
							</div>

							<div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-50 pt-5">
								<button
									type="button"
									onClick={() => setIsCreateModalOpen(false)}
									className="rounded-xl px-5 py-2.5 text-sm cursor-pointer font-bold text-gray-600 hover:bg-gray-100 transition-colors"
								>
									Hủy
								</button>
								<button
									type="submit"
									className="rounded-xl cursor-pointer bg-[#f9622e] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-[#ff7240] hover:shadow-orange-500/40 active:scale-95 transition-all"
								>
									Tạo nhóm
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Auth Prompt Modal */}
			<AuthPromptModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				feature="tham gia nhóm"
			/>
		</MainLayout>
	);
}
