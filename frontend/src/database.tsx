import './App.css'
import { useState } from 'react'
import { Users } from './users'
import { PhoneIcon, AcademicCapIcon, ChevronDoubleDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid'

function Database() {
    const [expandedUsersExp, setExpandedUsersExp] = useState<Record<string, boolean>>({})
    const [expandedUsersProj, setExpandedUsersProj] = useState<Record<string, boolean>>({})
    const [filters, setFilters] = useState({
        company: '',
        responsibilities: '',
        skills: ''
    })
    const [showFilters, setShowFilters] = useState(false)

    const filteredUsers = Users.filter((user: any) => {
        const companyMatch = filters.company === '' || 
            user.work_experience.some((exp: any) => 
                exp.company.toLowerCase().includes(filters.company.toLowerCase())
            )
        
        const responsibilitiesMatch = filters.responsibilities === '' || 
            user.work_experience.some((exp: any) => 
                exp.responsibilities.some((resp: any) => 
                    resp.toLowerCase().includes(filters.responsibilities.toLowerCase())
                )
            )
        
        const skillsMatch = filters.skills === '' || 
            user.skills.some((skill: any) => 
                skill.toLowerCase().includes(filters.skills.toLowerCase())
            )
        
        return companyMatch && responsibilitiesMatch && skillsMatch
    })

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Present'; 
        
        const date = new Date(dateString);
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();
        
        // Pad month with leading zero if needed
        const formattedMonth = month < 10 ? `0${month}` : month;
        
        return `${formattedMonth}/${year}`;
    };

    const calculateDuration = (startDateStr: string, endDateStr: string | null): string => {
    // Handle "Present" case for current positions
    if (!startDateStr) return "";
    
    const startDate = new Date(startDateStr);
    const endDate = (endDateStr) ? new Date(endDateStr) : new Date();
    
    // Calculate total months difference
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += endDate.getMonth() - startDate.getMonth();
    
    // Calculate years and remaining months
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    // Build the duration string
    let durationStr = "";
    if (years > 0) durationStr += `${years} 年`;
    if (remainingMonths > 0) {
        if (durationStr) durationStr += " ";
        durationStr += `${remainingMonths} 月`;
    }
    
    return durationStr || "不足1月";
    };

    const toggleExpandExp = (userId: string) => {
        setExpandedUsersExp(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }))
    }

    const toggleExpandProj = (userId: string) => {
        setExpandedUsersProj(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }))
    }

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const clearFilters = () => {
        setFilters({
            company: '',
            responsibilities: '',
            skills: ''
        })
    }
    
    return (
        <div className="container flex flex-row">


            <div className="bg-base-200 p-4 rounded-lg shadow-md mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">篩選條件</h2>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn btn-sm"
                        >
                            {showFilters ? '隱藏篩選' : '顯示篩選'}
                        </button>
                        <button 
                            onClick={clearFilters}
                            className="btn btn-sm btn-ghost"
                            disabled={!filters.company && !filters.responsibilities && !filters.skills}
                        >
                            <XMarkIcon className="w-4 h-4 mr-1" />
                            清除
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="flex flex-col">
                        <div className="form-control m-3">
                            <label className="label">
                                <span className="label-text">公司名稱</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="company"
                                    placeholder="搜尋公司..."
                                    className="input input-bordered w-full pl-8"
                                    value={filters.company}
                                    onChange={handleFilterChange}
                                />
                                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                            </div>
                        </div>

                        <div className="form-control m-3">
                            <label className="label">
                                <span className="label-text">工作內容</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="responsibilities"
                                    placeholder="搜尋工作內容..."
                                    className="input input-bordered w-full pl-8"
                                    value={filters.responsibilities}
                                    onChange={handleFilterChange}
                                />
                                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                            </div>
                        </div>

                        <div className="form-control m-3">
                            <label className="label">
                                <span className="label-text">技能</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="skills"
                                    placeholder="搜尋技能..."
                                    className="input input-bordered w-full pl-8"
                                    value={filters.skills}
                                    onChange={handleFilterChange}
                                />
                                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="mt-2 text-sm text-gray-500">
                    找到 {filteredUsers.length} 位符合條件的使用者
                </div>
            </div>


            <div className="flex flex-col ">
                {filteredUsers.map((user: any) => (
                    <div key={user._id} className="flex flex-row bg-secondary m-4">
                        <div className="card bg-accent w-96 mt-4 m-4 mr-0">
                            <figure className="px-10 pt-10">
                                <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                alt="User"
                                className="rounded-xl" />
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">{user.name}</h2>
                                <div className="flex flex-row">
                                    <PhoneIcon className="size-6 mr-3"> </PhoneIcon>
                                    <p>{user.contact}</p>
                                </div>
                                <div className="flex flex-row">
                                    <AcademicCapIcon className="size-6 mr-3"> </AcademicCapIcon>
                                    <p>{user.education[0].field} ({user.education[0].degree}) - {user.education[0].school}</p>
                                </div>
                                <div className="flex flex-wrap flex-row justify-center w-full">
                                    {user.skills.map((skill: any, si: number) => (
                                        <div key={si} className="tooltip tooltip-top" data-tip={skill}>
                                            <div className="badge badge-ghost whitespace-nowrap text-ellipsis overflow-hidden m-1 max-w-[10rem]">
                                                <span className="inline-block min-w-0 truncate"> {skill} </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="card flex flex-col w-200 bg-accent p-4 m-4 ml-2 mb-0">
                                <p className="text-2xl font-bold mt-3"> 經驗 </p>
                                {user.work_experience.slice(0, 1).map((experience: any, index: number) => (
                                <div key={index} className="flex flex-col pt-4 pb-4 border-b-gray-400 border-solid border-b-1">
                                    <p className="text-lg font-semibold">{experience.position}</p>
                                    <p className="text-sm">{experience.company}</p>
                                    <p className="text-sm">{formatDate(experience.start_date)} - {formatDate(experience.end_date)} • {calculateDuration(experience.start_date, experience.end_date)}</p>
                                    <ul className='list-disc pl-5 space-y-1 mt-2'>
                                        {experience.responsibilities.map((responsibility: any, i: number) => (
                                            <li key={i} className="text-sm">{responsibility}</li>
                                        ))}
                                    </ul>
                                </div>
                                ))}
                                {user.work_experience.length > 1 && (
                                    <>
                                        <div className={`overflow-hidden transition-all duration-300 ${expandedUsersExp[user._id] ? 'max-h-[2000px]' : 'max-h-0'}`}>
                                            {user.work_experience.slice(1).map((experience: any, index: number) => (
                                                <div key={index + 1} className="flex flex-col pt-4 pb-4 border-b-gray-400 border-solid border-b">
                                                    <p className="text-lg font-semibold">{experience.position}</p>
                                                    <p className="text-sm">{experience.company}</p>
                                                    <p className="text-sm">{formatDate(experience.start_date)} - {formatDate(experience.end_date)} • {calculateDuration(experience.start_date, experience.end_date)}</p>
                                                    <ul className='list-disc pl-5 space-y-1 mt-2'>
                                                        {experience.responsibilities.map((responsibility: any, i: number) => (
                                                            <li key={i} className="text-sm">{responsibility}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <button 
                                            onClick={() => toggleExpandExp(user._id)}
                                            className="btn btn-ghost btn-sm self-start mt-2 mx-auto"
                                        >
                                            {expandedUsersExp[user._id] ? (
                                                <>
                                                    <span>顯示更少</span>
                                                    <ChevronDoubleDownIcon className="w-4 h-4 ml-1 transform rotate-180" />
                                                </>
                                            ) : (
                                                <>
                                                    <span>顯示更多 ({user.work_experience.length - 1})</span>
                                                    <ChevronDoubleDownIcon className="w-4 h-4 ml-1" />
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="card flex flex-col w-200 bg-accent p-4 m-4 ml-2 mt-2">
                                <p className="text-2xl font-bold mt-3"> 項目 </p>
                                {user.projects.slice(0, 1).map((project: any, index: number) => (
                                <div key={index} className="flex flex-col pt-4 pb-4 border-b-gray-400 border-solid border-b-1">
                                    <p className="text-lg font-semibold">{project.responsibility}</p>
                                    <p className="text-sm">{project.name}</p>
                                    <p className="text-sm">{project.technologies.join(" • ")}</p>
                                </div>
                                ))}
                                {user.projects.length > 1 && (
                                    <>
                                        <div className={`overflow-hidden transition-all duration-300 ${expandedUsersProj[user._id] ? 'max-h-[2000px]' : 'max-h-0'}`}>
                                            {user.projects.slice(1).map((project: any, index: number) => (
                                                <div key={index} className="flex flex-col pt-4 pb-4 border-b-gray-400 border-solid border-b-1">
                                                    <p className="text-lg font-semibold">{project.responsibility}</p>
                                                    <p className="text-sm">{project.name}</p>
                                                    <p className="text-sm">{project.technologies.join(" • ")}</p>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <button 
                                            onClick={() => toggleExpandProj(user._id)}
                                            className="btn btn-ghost btn-sm self-start mt-2 mx-auto"
                                        >
                                            {expandedUsersProj[user._id] ? (
                                                <>
                                                    <span>顯示更少</span>
                                                    <ChevronDoubleDownIcon className="w-4 h-4 ml-1 transform rotate-180" />
                                                </>
                                            ) : (
                                                <>
                                                    <span>顯示更多 ({user.projects.length - 1})</span>
                                                    <ChevronDoubleDownIcon className="w-4 h-4 ml-1" />
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Database


