import './App.css'
import { useState } from 'react'
import { Users } from './users'
import { ChevronDoubleDownIcon, MagnifyingGlassIcon, XMarkIcon, UserIcon, BriefcaseIcon} from '@heroicons/react/16/solid'

function Database() {
    const [expandedUsersExp, setExpandedUsersExp] = useState<Record<string, boolean>>({})
    const [expandedUsersProj, setExpandedUsersProj] = useState<Record<string, boolean>>({})
    const [filters, setFilters] = useState({
        company: '',
        responsibilities: '',
        skills: '',
        country: '',
        city: '',
        language: '',
        salary: ''
    })
    const [showFilters, setShowFilters] = useState(false)

    const filteredUsers = Users.filter((user: any) => {
        const companyMatch = filters.company === '' || 
            user.work_experience.some((exp: any) => 
                exp.company_name.toLowerCase().includes(filters.company.toLowerCase())
            )
        
        const responsibilitiesMatch = filters.responsibilities === '' || 
            user.work_experience.some((exp: any) => 
                exp.skills.some((resp: any) => 
                    resp.toLowerCase().includes(filters.responsibilities.toLowerCase())
                )
            )
        
        const skillsMatch = filters.skills === '' || 
            user.others.skills.some((skill: any) => 
                skill.toLowerCase().includes(filters.skills.toLowerCase())
            )
        
        const countryMatch = filters.country === '' || 
            (user.basic_info.current_location_norm || '').toLowerCase().includes(filters.country.toLowerCase())
        
        const cityMatch = filters.city === '' || 
            (user.basic_info.current_location || '').toLowerCase().includes(filters.city.toLowerCase())
        
        const languageMatch = filters.language === '' || 
            user.others.languages.some((lang: any) => 
                lang.language_name.toLowerCase().includes(filters.language.toLowerCase())
            )

        const salaryMatch = () => {
            if (filters.salary === '') return true;
            
            const filterSalary = parseInt(filters.salary);
            if (isNaN(filterSalary)) return true;

            const salaryRange = user.basic_info.desired_salary;
            if (!salaryRange || typeof salaryRange !== 'string') return false;

            const [minStr, maxStr] = salaryRange.split('-');
            const minSalary = parseInt(minStr);
            const maxSalary = parseInt(maxStr);

            if (isNaN(minSalary) || isNaN(maxSalary)) return false;

            return filterSalary >= minSalary && filterSalary <= maxSalary;
        };
        
        return companyMatch && responsibilitiesMatch && skillsMatch && countryMatch
        && cityMatch && languageMatch && salaryMatch()
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
            skills: '',
            country: '',
            city: '',
            language: '',
            salary: ''
        })
    }

    const educationCard = (education: any) => (
        <div className="flex flex-col p-4 mb-4 border-solid border-l-neutral border-l-3 bg-secondary ">
            <div className="flex w-full justify-between">
                <p className="text-lg font-semibold pb-4">{education.school_name}</p>
                {education.still_active == 1 ? 
                    <p className="text-sm">{education.start_time_year}.{education.start_time_month} - 现在 </p> :
                    <p className="text-sm">{education.start_time_year}.{education.start_time_month} - {education.end_time_year}.{education.end_time_month}</p>
                }
            </div>
            <div className="flex w-full justify-between pr-8">
                <p className="text-sm">学位: {education.degree} </p>
                <p className="text-sm">专业: {education.major}</p>
                <p className="text-sm">地点: {education.location}</p>
                {education.abroad == 1 && <p className="text-sm">海外国家: {education.abroad_country}</p>}
            </div>
        </div>
    );
    
    const experienceCard = (experience: any) => (
        <div className="flex flex-col p-4 mb-4 border-solid border-l-neutral border-l-3 bg-secondary ">
            <div className="flex w-full justify-between">
                <p className="text-lg font-semibold pb-4">{experience.company_name}</p>
                {experience.still_active == 1 ? 
                    <p className="text-sm">{experience.start_time_year}.{experience.start_time_month} - 现在 </p> :
                    <p className="text-sm">{experience.start_time_year}.{experience.start_time_month} - {experience.end_time_year}.{experience.end_time_month}</p>
                }
            </div>
            <div className="flex w-full justify-between pr-8">
                <p className="text-sm">职位名称: {experience.job_title}</p>
                <p className="text-sm">公司行业: {experience.industry}</p>
                <p className="text-sm">公司规模: {experience.company_size}</p>
                <p className="text-sm">工作职能: {experience.job_function}</p>
            </div>
            <p className="w-full p-4 bg-accent mt-4 text-sm"> {experience.description}</p>
            <ul className='list-disc space-y-1 mt-2'>
                {experience.skills.map((skill: any, i: number) => (
                    <div key={i} className="tooltip tooltip-top" data-tip={skill}>
                        <div className="badge badge-ghost whitespace-nowrap text-ellipsis overflow-hidden m-1 max-w-[10rem]">
                            <span className="inline-block min-w-0 truncate"> {skill} </span>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );

    const skillsCard = (user: any) => (
        <div className="flex flex-col p-4 mb-4 border-solid border-l-neutral border-l-3 bg-secondary">
            <p className="text-lg font-semibold"> 技能 </p>
            <div className = "flex mt-2">
                <span className='mt-1'> 主要技能: </span>
                <ul className='list-disc mt-0.5'>
                    {user.others.skills.map((skill: any, i: number) => (
                        <div key={i} className="tooltip tooltip-top" data-tip={skill}>
                            <div className="badge badge-ghost whitespace-nowrap text-ellipsis overflow-hidden m-1 max-w-[10rem]">
                                <span className="inline-block min-w-0 truncate"> {skill} </span>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>
            <div className = "flex mt-2">
                <span className='mt-1'> IT 技能: </span>
                <ul className='list-disc mt-0.5'>
                    {user.others.it_skills.map((skill: any, i: number) => (
                        <div key={i} className="tooltip tooltip-top" data-tip={skill}>
                            <div className="badge badge-ghost whitespace-nowrap text-ellipsis overflow-hidden m-1 max-w-[10rem]">
                                <span className="inline-block min-w-0 truncate"> {skill} </span>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>  
            <div className = "flex mt-2">
                <span className='mt-1'> 商業技能: </span>
                <ul className='list-disc mt-0.5'>
                    {user.others.it_skills.map((skill: any, i: number) => (
                        <div key={i} className="tooltip tooltip-top" data-tip={skill}>
                            <div className="badge badge-ghost whitespace-nowrap text-ellipsis overflow-hidden m-1 max-w-[10rem]">
                                <span className="inline-block min-w-0 truncate"> {skill} </span>
                            </div>
                        </div>
                    ))}
                </ul>
            </div>  
        </div>
    );

    const languageCard = (user: any) => (
        <div className="flex flex-col p-4 mb-4 border-solid border-l-neutral border-l-3 bg-secondary">
            <p className="text-lg font-semibold mb-2"> 語言 </p>
            {user.others.languages.map((language: any, i: number) => (
                <div key={i}>
                    <p className="mt-2 mb-2"> {language.language_name}: {language.proficiency} </p>
                </div>
            ))}
        </div>
    );

    const certificateCard = (user: any) => (
        <div className="flex flex-col p-4 mb-4 border-solid border-l-neutral border-l-3 bg-secondary">
            <p className="text-lg font-semibold mb-2"> 证书 </p>
            {user.others.certificate.map((cert: any, i: number) => (
                <div key={i}>
                    <p className="text-base font-semibold">{cert.cert_name}</p>
                    <p className="text-sm"> {cert.issuing_authority} </p>
                    <p className="text-sm"> 颁发日期: {cert.issue_date}</p>
                    <p className="text-sm"> 证书编号: {cert.cert_number} </p>
                </div>
            ))}
        </div>
    );

    const awardCard = (user: any) => (
        <div className="flex flex-col p-4 mb-4 border-solid border-l-neutral border-l-3 bg-secondary">
            <p className="text-lg font-semibold mb-2"> 奖项 </p>
            {user.others.awards.map((award: any, i: number) => (
                <div key={i}>
                    <p className="text-base font-semibold">{award.award_name}</p>
                    <p className="text-sm"> {award.awarding_organization} </p>
                    <p className="text-sm"> 获奖日期: {award.award_date}</p>
                    <p className="text-sm"> 奖项等级: {award.award_level} </p>
                    <p className="text-sm"> 奖项说明: {award.description} </p>
                </div>
            ))}
        </div>
    );

    const projectCard = (project: any) => (
        <div className="flex flex-col p-4 mb-4 border-solid border-l-neutral border-l-3 bg-secondary ">
            <div className="flex w-full justify-between">
                <p className="text-lg font-semibold pb-4">{project.project_name}</p>
                <p className="text-sm">{project.start_time} - {project.end_time}</p>
            </div>
            <div className="flex w-full justify-between pr-8">
                <p className="text-sm">项目职能: {project.project_role}</p>
                <p className="text-sm">公司规模: {project.team_size}</p>
            </div>
            <p className="w-full p-4 bg-accent mt-4 text-sm"> {project.description}</p>
            <ul className='list-disc space-y-1 mt-2'>
                {project.technologies.map((skill: any, i: number) => (
                    <div key={i} className="tooltip tooltip-top" data-tip={skill}>
                        <div className="badge badge-ghost whitespace-nowrap text-ellipsis overflow-hidden m-1 max-w-[10rem]">
                            <span className="inline-block min-w-0 truncate"> {skill} </span>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );

    const userCards = <div className="flex flex-col bg-secondary">
        {filteredUsers.map((user: any) => (
            <div key={user._id.$oid} className="flex flex-col bg-secondary m-4">
                <div className="w-full max-w-4xl bg-gradient-to-r from-indigo-400 to-purple-500 rounded-tl-xl rounded-tr-xl rounded-none p-6 flex flex-col md:flex-row text-primary-content">
                    <div className="flex items-start space-x-4 w-full">
                        <img
                        src={user.avatar || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                        alt="User"
                        className="w-20 h-20 rounded-full object-cover border-4 border-white"
                        />
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2 text-xl font-semibold">
                                <UserIcon className="w-5 h-5" />
                                <span>{user.basic_info.name}</span>
                            </div>
                            <div className="text-sm space-x-2">
                                <span>{user.basic_info.age} 岁</span>
                                <span>{user.basic_info.gender}</span>
                                <a href={`mailto:${user.contact_info.email}`} className="text-blue-200 hover:underline"> {user.contact_info.email} </a>
                            </div>
                            <div className="flex items-center text-sm space-x-1 mt-1">
                                <BriefcaseIcon className="w-4 h-4" />
                                <span>{user.basic_info.num_work_experience} 年工作经验</span>
                            </div>
                        </div>
                    </div>
                </div>

                

                <div className="flex flex-col w-full max-w-4xl bg-accent p-6 border-none">
                    <h2 className="text-xl text-info font-bold pb-3 mt-3 mb-3 border-b-gray-400 border-b-2"> 基本信息 </h2>
                    <div className="grid grid-cols-3 gap-y-4 gap-x-8">
                        <p> 姓名: {user.basic_info.name} </p>
                        <p> 年齡: {user.basic_info.age} </p>
                        <p> 性别: {user.basic_info.gender} </p>
                        <p> 生日: {user.basic_info.date_of_birth} </p>
                        <p> 邮箱: <a href={`mailto:${user.contact_info.email}`} className="text-blue-400 hover:underline"> {user.contact_info.email} </a> </p>
                        <p> 专业: {user.basic_info.major} </p>
                        <p> 毕业院校: {user.basic_info.school_name} </p>
                        <p> 工作年限: {user.basic_info.num_work_experience} 年 </p>
                        <p> 当前公司：{user.basic_info.current_company} </p>
                        <p> 求职状态：{user.basic_info.current_status} </p>
                        <p> 专业级别：{user.basic_info.professional_level} </p>
                        <p> 详细地址：{user.basic_info.detailed_location} </p>
                        <p> 期望工作地点: {user.basic_info.expect_location} </p>
                        <p> 开始工作年份：{user.basic_info.work_start_year} </p>
                        <p> 薪金要求: {user.basic_info.desired_salary} </p>
                    </div>
                </div>

                <div className="flex flex-col w-full max-w-4xl bg-accent p-6 border-none">
                    <h2 className="text-xl text-info font-bold pb-3 mt-3 mb-3 border-b-gray-400 border-b-2"> 教育背景 </h2>
                    {user.education_experience.map((education: any, index: number) => (
                        <div key={index}> {educationCard(education)} </div>
                    ))}
                </div>

                <div className="flex flex-col">
                    <div className="card flex flex-col w-full bg-accent p-4 rounded-bl-xl rounded-br-xl rounded-none mb-0">
                        <h2 className="text-xl text-info font-bold mt-3 mb-3 pb-3 border-gray-400 border-b-2"> 經驗 </h2>
                        {user.work_experience.slice(0, 1).map((experience: any, index: number) => (
                            <div key={index}> {experienceCard(experience)} </div>
                        ))}
                        {user.work_experience.length > 1 && (
                            <>
                                <div className={`overflow-hidden transition-all duration-300 ${expandedUsersExp[user._id] ? 'max-h-[2000px]' : 'max-h-0'}`}>
                                    {user.work_experience.slice(1).map((exp: any, index: number) => (
                                    <div key={index}>{experienceCard(exp)}</div>
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
                </div>

                {user.project_experience.length > 0 && 
                <div className="flex flex-col">
                    <div className="card flex flex-col w-full bg-accent p-4 rounded-bl-xl rounded-br-xl rounded-none mb-0">
                        <h2 className="text-xl text-info font-bold mb-3 pb-3 border-gray-400 border-b-2"> 项目 </h2>
                        {user.project_experience.map((project: any, pindex: number) => (
                            <div key={pindex}> {projectCard(project)} </div>
                        ))}
                    </div>
                </div>}
                    
                <div className="flex flex-col">
                    <div className="card flex flex-col w-full bg-accent p-4 rounded-bl-xl rounded-br-xl rounded-none mb-0">
                        <h2 className="text-xl text-info font-bold mb-3 pb-3 border-gray-400 border-b-2"> 其它 </h2>
                        {skillsCard(user)}
                        {user.others.languages.length > 0 && languageCard(user)}
                        {user.others.certificate.length > 0 && certificateCard(user)}
                        {user.others.awards.length > 0 && awardCard(user)}
                    </div>
                </div>

            </div>
        ))}
    </div>

    
    return (
        <div className="container flex flex-row">
            <div className="bg-primary p-4  flex-none">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl text-info font-bold mr-2">篩選條件</h2>
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

                        <div className="form-control m-3">
                            <label className="label">
                                <span className="label-text">国家与地区</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="搜尋国家或地区..."
                                    className="input input-bordered w-full pl-8"
                                    value={filters.country}
                                    onChange={handleFilterChange}
                                />
                                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                            </div>
                        </div>

                        <div className="form-control m-3">
                            <label className="label">
                                <span className="label-text">城市</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="搜尋城市..."
                                    className="input input-bordered w-full pl-8"
                                    value={filters.city}
                                    onChange={handleFilterChange}
                                />
                                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                            </div>
                        </div>

                        <div className="form-control m-3">
                            <label className="label">
                                <span className="label-text">语言</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="language"
                                    placeholder="搜尋语言..."
                                    className="input input-bordered w-full pl-8"
                                    value={filters.language}
                                    onChange={handleFilterChange}
                                />
                                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                            </div>
                        </div>

                        <div className="form-control m-3">
                            <label className="label">
                                <span className="label-text">期望薪资</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="salary"
                                    placeholder="搜尋薪资範圍..."
                                    className="input input-bordered w-full pl-8"
                                    value={filters.salary}
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
            <div className="flex-1 bg-secondary min-h-screen">
                {userCards}
            </div>
        </div>
    )
}

export default Database


