"use client"
import { useProfileStore } from "@/store/user-profile/user-profile";
import { Person } from "@mui/icons-material";
import Image from "next/image";
import { apiSoftInsta } from "../config/config";
import { useEffect, useState } from "react";
import { Alert, Button, FormControl, MenuItem, Select, Snackbar } from "@mui/material";
import ModalPhoto from "@/components/shared/modal-photo/modal-photo";
import AlertO from "@/components/shared/alert/alert";
import { useSettingStore } from "@/store/pages/setting/useSettingStore";

export default function UpdateProfile() {
	const { person, getPerson, setOpenModalPhoto, updateProfile } = useProfileStore();
	const [TextLength, setTextLength] = useState('');
	const {darkMode:dm} = useSettingStore()
	let [Gender, setGender] = useState(0);

	const handleChangeGender = (event) => {
		setGender(event.target.value);
	};

	const editProfile = (e) => {
		const editForm = {
			about: e.target['about'].value,
			gender: Gender,
		}
		updateProfile(editForm)
	}

	useEffect(() => {
		getPerson()
	}, []);

	console.log(Select, 'select');
	
	return <><div className='flex flex-col gap-4 px-4 pt-10 w-full h-screen overflow-auto mx-auto'>
		<AlertO />
		<ModalPhoto />
		<p className='text-xl font-[700] mb-5'>Редактировать профиль</p>
		<form onSubmit={(e) => {
			e.preventDefault();
			editProfile(e)
		}} className='flex flex-col gap-4'>
			<div className='flex justify-between items-center p-4 bg-slate-500/10 rounded-xl w-full'>
				<div className="flex gap-4 items-center">
					<div style={{ backgroundImage: `url("${apiSoftInsta + '/images/' + person.image}")` }} className="size-[55px] bg-cover bg-center border rounded-full flex flex-col items-center justify-center">
						{person.image ? (
							<Image
								className={'size-[0%] rounded-full shadow-lg'}
								src={apiSoftInsta + '/images/' + person.image}
								width={50}
								priority
								quality={0}
								height={50}
								alt=''
							/>
						) : (
							<Person className='text-gray-500' />
						)}
					</div>
					<div className='flex flex-col'>
						<p className="font-[700]">{person.userName}</p>
						<p className='font-[400] text-gray-500'>
							{person.lastName} {person.firstName}
						</p>
					</div>
				</div>
				<Button onClick={setOpenModalPhoto} variant='contained' sx={{ height: 'fit-content', textTransform: 'none', fontSize: '14px' }}>Новое фото</Button>
			</div>
			<label htmlFor='about' className="font-[700]">О себе</label>
			<div className="relative">
				<textarea name="about" id="about" defaultValue={person.about} maxLength={200} placeholder="О себе" onChange={(e) => setTextLength(e.target.value)}
					className={`border-gray-500/50 w-full resize-none bg-transparent border focus-within:${dm? 'border-white' : 'border-black'} h-20 outline-none rounded-xl p-4`}>
				</textarea>
				<p className={`absolute bottom-3 ${dm ? 'bg-[#010101]' : 'bg-white'} rounded-lg pl-1 right-3`}>{TextLength.length} / 200</p>
			</div>

			<label className="font-[700]">Пол</label>
			<FormControl fullWidth>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={Gender}
					onChange={handleChangeGender}
					sx={{ borderRadius: '15px', color: dm? 'white' : 'black', border:'1px solid #aaa5', outline: 'none' }}
					
					MenuProps={{
						PaperProps: {
						  sx: {
							borderRadius: "15px",
							backgroundColor: dm ? "#111111" : "#ffffff",
							color: dm ? "#ffffff" : "#000000",
							boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
						  },
						},
						MenuListProps: {
							sx: {
								padding:'0'
							}
						}
					  }}
				>
					<MenuItem sx={{ padding: '15px' }} value={0}>Мужской</MenuItem>
					<MenuItem sx={{ padding: '15px' }} value={1}>Женский</MenuItem>
					<MenuItem sx={{ padding: '15px' }} value={2}>Предпочитаю не указывать</MenuItem>
				</Select>
			</FormControl>
			<Button type='submit' variant='contained' sx={{ height: 'fit-content', width: 'fit-content', alignSelf: 'end', borderRadius: '10px', padding: '10px 40px', fontSize: '14px', textTransform: 'none' }}>Отправить</Button>
		</form>
		<div>
		</div>
	</div>
	</>
}
