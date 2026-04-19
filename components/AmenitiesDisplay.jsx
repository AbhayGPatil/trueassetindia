'use client';

import styles from './AmenitiesDisplay.module.css';

// SVG Icon Components (same as in AmenitiesSelector)
const IconSVG = ({ type, size = 16 }) => {
  const icons = {
    power_backup: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="m536-84-56-56 142-142-340-340-142 142-56-56 56-58-56-56 84-84-56-58 56-56 58 56 84-84 56 56 58-56 56 56-142 142 340 340 142-142 56 56-56 58 56 56-84 84 56 58-56 56-58-56-84 84-56-56-58 56Z"/></svg>
    ),
    conference_room: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm8 0c1.66 0 2.99-1.34 2.99-3S25.66 5 24 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.64 2.2 1.61 2.93 2.95h4.05v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
    ),
    guest_accommodation: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M280-240h40v-60h320v60h40v-160q0-33-23.5-56.5T600-480H460v140H320v-180h-40v280Zm145.5-134.5Q440-389 440-410t-14.5-35.5Q411-460 390-460t-35.5 14.5Q340-431 340-410t14.5 35.5Q369-360 390-360t35.5-14.5ZM160-120v-480l320-240 320 240v480H160Zm80-80h480v-360L480-740 240-560v360Zm240-270Z"/></svg>
    ),
    retail_shops: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
    ),
    laundry: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M165-480 45-688l264-152h51q16 48 38 84t82 36q60 0 82-36t38-84h51l263 153-119 207-75-41v192l-63 55q-3 2-8 5t-9 5v-393l125 69 40-70-153-89q-24 49-70.5 78T480-640q-55 0-101.5-29T308-747l-154 89 41 70 125-69v237q-21 2-41 6.5T240-401v-120l-75 41Zm21 295-52-61 87-74q23-20 52.5-30.5T335-361q32 0 61 10.5t52 30.5l116 99q12 10 28.5 15.5T626-200q18 0 33.5-5t27.5-16l87-75 52 62-87 74q-23 20-52 30t-61 10q-32 0-61.5-10T512-160l-116-99q-12-10-27.5-15.5T335-280q-17 0-33.5 5.5T273-259l-87 74Zm294-455Z"/></svg>
    ),
    waste_disposal: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
    ),
    lift: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M280-240h120v-160h40v-100q0-33-23.5-56.5T360-580h-40q-33 0-56.5 23.5T240-500v100h40v160Zm95.5-394.5Q390-649 390-670t-14.5-35.5Q361-720 340-720t-35.5 14.5Q290-691 290-670t14.5 35.5Q319-620 340-620t35.5-14.5ZM520-520h200L620-680 520-520Zm100 240 100-160H520l100 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z"/></svg>
    ),
    reserved_parking: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M600-520h60v-80h80q25 0 42.5-17.5T800-660v-40q0-25-17.5-42.5T740-760H600v240Zm60-140v-40h80v40h-80ZM520-400q-33 0-56.5-23.5T440-480v-320q0-33 23.5-56.5T520-880h320q33 0 56.5 23.5T920-800v320q0 33-23.5 56.5T840-400H720v280h-80v-280H520Zm0-80h320v-320H520v320Zm160-160ZM320-120q-17 0-28.5-11.5T280-160v-40H80v-80h240v-200H80v-80h208l-42-120H80v-80h180q19 0 34.5 11t21.5 29l84 240v320q0 17-11.5 28.5T360-120h-40ZM220-320q25 0 42.5-17.5T280-380q0-25-17.5-42.5T220-440q-25 0-42.5 17.5T160-380q0 25 17.5 42.5T220-320Z"/></svg>
    ),
    service_lift: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M280-240h120v-160h40v-100q0-33-23.5-56.5T360-580h-40q-33 0-56.5 23.5T240-500v100h40v160Zm95.5-394.5Q390-649 390-670t-14.5-35.5Q361-720 340-720t-35.5 14.5Q290-691 290-670t14.5 35.5Q319-620 340-620t35.5-14.5ZM520-520h200L620-680 520-520Zm100 240 100-160H520l100 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z"/></svg>
    ),
    visitor_parking: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M160-160v-640 292-12 360Zm40-356v264q0 14 9 23t23 9h16q14 0 23-9t9-23v-48h167q5-22 12.5-41.5T478-380H280v-120h336q34-14 71-18t73 1l-66-191q-5-14-16.5-23t-25.5-9H308q-14 0-25.5 9T266-708l-66 192Zm106-64 28-80h292l28 80H306Zm82.5 168.5Q400-423 400-440t-11.5-28.5Q377-480 360-480t-28.5 11.5Q320-457 320-440t11.5 28.5Q343-400 360-400t28.5-11.5ZM692-150l142-142-30-30-112 112-56-56-30 30 86 86Zm169.5-231.5Q920-323 920-240T861.5-98.5Q803-40 720-40T578.5-98.5Q520-157 520-240t58.5-141.5Q637-440 720-440t141.5 58.5ZM160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v331q-18-13-38-22.5T800-508v-292H160v640h292q7 22 16.5 42T491-80H160Z"/></svg>
    ),
    maintenance_staff: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M12.5 8c1.93 0 3.5-1.57 3.5-3.5S14.43 1 12.5 1 9 2.57 9 4.5 10.57 8 12.5 8zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-5.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
    ),
    swimming_pool: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M80-120v-80q38 0 57-20t75-20q56 0 77 20t57 20q36 0 57-20t77-20q56 0 77 20t57 20v80q-59 0-77.5-20T748-160q-36 0-57 20t-77 20q-56 0-77-20t-57-20q-36 0-54.5 20T80-120Zm0-180v-80q38 0 57-20t75-20q56 0 77.5 20t56.5 20q36 0 57-20t77-20q56 0 77 20t57 20v80q-59 0-77.5-20T748-340q-36 0-55.5 20T614-300q-57 0-77.5-20T480-340q-38 0-56.5 20T346-300q-59 0-78.5-20T212-340q-36 0-54.5 20T80-300Zm196-204 133-133-40-40q-33-33-70-48t-91-15v-100q75 0 124 16.5t96 63.5l256 256q-17 11-33 17.5t-37 6.5q-36 0-57-20t-77-20q-56 0-77 20t-57 20q-21 0-37-6.5T276-504Zm463-306.5q29 29.5 29 70.5 0 42-29 71t-71 29q-42 0-71-29t-29-71q0-41 29-70.5t71-29.5q42 0 71 29.5Z"/></svg>
    ),
    gym: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="m536-84-56-56 142-142-340-340-142 142-56-56 56-58-56-56 84-84-56-58 56-56 58 56 84-84 56 56 58-56 56 56-142 142 340 340 142-142 56 56-56 58 56 56-84 84 56 58-56 56-58-56-84 84-56-56-58 56Z"/></svg>
    ),
    garden: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M480-600q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm-70.5 218.5Q378-403 364-438q-5 0-9 .5t-9 .5q-52 0-89-37t-37-89q0-21 7-40.5t21-36.5q-13-17-20-36.5t-7-40.5q0-52 36.5-89t88.5-37q5 0 9 .5t9 .5q14-35 45.5-56.5T480-920q39 0 70.5 21.5T596-842q5 0 9-.5t9-.5q52 0 88.5 37t36.5 89q0 21-6.5 40.5T712-640q13 17 20 36.5t7 40.5q0 52-36.5 89T614-437q-5 0-9-.5t-9-.5q-14 35-45.5 56.5T480-360q-39 0-70.5-21.5ZM480-80q0-74 28.5-139.5T586-334q49-49 114.5-77.5T840-440q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm98-98q57-21 100-64t64-100q-57 21-100 64t-64 100Zm-98 98q0-74-28.5-139.5T374-334q-49-49-114.5-77.5T120-440q0 74 28.5 139.5T226-186q49 49 114.5 77.5T480-80Zm-98-98q-57-21-100-64t-64-100q57 21 100 64t64 100Zm196 0Zm-196 0Zm232-339q19 0 32.5-13.5T660-563q0-14-7.5-24.5T633-604l-35-17q-2 11-6 21.5t-9 19.5q-5 9-12 17t-15 15l32 23q5 4 11.5 6t14.5 2Zm-16-142 35-17q12-6 19-17t7-24q0-19-13-32.5T614-763q-8 0-14 2t-12 6l-33 23q8 7 15.5 15t12.5 17q5 9 9 19.5t6 21.5Zm-159-93q10-4 20-6t21-2q11 0 21 2t20 6l5-44q2-18-12.5-31T480-840q-19 0-33.5 13T434-796l5 44Zm41 312q19 0 33.5-13t12.5-31l-5-44q-10 4-20 6t-21 2q-11 0-21-2t-20-6l-5 44q-2 18 12.5 31t33.5 13ZM362-659q2-11 6-21.5t9-19.5q5-9 12-17t15-15l-32-23q-5-4-11.5-6t-14.5-2q-19 0-32.5 13.5T300-717q0 13 7.5 24t19.5 17l35 17Zm-16 141q8 0 14-1.5t12-6.5l33-22q-8-7-15.5-15T377-580q-5-9-9-19.5t-6-21.5l-35 17q-12 6-19 17t-7 24q1 19 13.5 32t31.5 13Zm237-62Zm0-120Zm-103-60Zm0 240ZM377-700Zm0 120Z"/></svg>
    ),
    playground: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M80-160v-80h230q-22-85-83.5-146.5T80-470q20-5 39.5-7.5T160-480q134 0 227 93t93 227H80Zm480 0q0-42-9-83.5T525-323q42-71 114.5-114T800-480q21 0 40.5 2.5T880-470q-85 22-146 83.5T650-240h230v80H560Zm-80-239q0-65 24-122t66-100.5q42-43.5 98.5-69.5T789-719q-56 35-98 86t-65 114q-44 21-80.5 51.5T480-399Zm-73-75q-12-9-24-17t-25-16q0-6 1-12.5t1-12.5q0-76-24-144t-68-124q66 27 114.5 77.5T457-606q-18 30-31 63.5T407-474Z"/></svg>
    ),
    rainwater_harvesting: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M160-120q-17 0-28.5-11.5T120-160q0-17 11.5-28.5T160-200h40v-240h-40q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h40v-240h-40q-17 0-28.5-11.5T120-800q0-17 11.5-28.5T160-840h640q17 0 28.5 11.5T840-800q0 17-11.5 28.5T800-760h-40v240h40q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440h-40v240h40q17 0 28.5 11.5T840-160q0 17-11.5 28.5T800-120H160Zm120-80h400v-240q-17 0-28.5-11.5T640-480q0-17 11.5-28.5T680-520v-240H280v240q17 0 28.5 11.5T320-480q0 17-11.5 28.5T280-440v240Zm285-154.5q35-34.5 35-83.5 0-39-22.5-67T480-620q-75 86-97.5 114.5T360-438q0 49 35 83.5t85 34.5q50 0 85-34.5ZM280-200v-560 560Z"/></svg>
    ),
    cctv: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M563-150q-11 13-27.5 14.5T506-145L353-273q-50-42-72-102t-11-123l-56-47q-12-11-13.5-26.5T209-600h-49v80q0 33-23.5 56.5T80-440v-400q33 0 56.5 23.5T160-760v80h115l62-75q11-13 27.5-14.5T394-760l55 46q61-23 124-12t113 53l153 128q13 11 14.5 27.5T844-489L563-150Zm-36-83 231-277-124-102q-42-34-95.5-33T434-623l-61-50-77 92 60 50q-12 54-3 107.5t51 88.5l123 102Zm0-220Z"/></svg>
    ),
    security_staff: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Z"/></svg>
    ),
    gate_entry: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M80-120q0-74 28.5-139.5T226-334q49-49 114.5-77.5T480-440q0 74-28.5 139.5T334-186q-49 49-114.5 77.5T80-120Zm98-98q57-21 100-64t64-100q-57 21-100 64t-64 100Zm-98 98q0-74-28.5-139.5T-334q-49-49-114.5-77.5T-560-440q0 74 28.5 139.5T-226-186q49 49 114.5 77.5T80-120Zm-98-98q-57-21-100-64t-64-100q57 21 100 64t64 100Zm196 0Zm-196 0Zm232-339q19 0 32.5-13.5T660-563q0-14-7.5-24.5T633-604l-35-17q-2 11-6 21.5t-9 19.5q-5 9-12 17t-15 15l32 23q5 4 11.5 6t14.5 2Zm-16-142 35-17q12-6 19-17t7-24q0-19-13-32.5T614-763q-8 0-14 2t-12 6l-33 23q8 7 15.5 15t12.5 17q5 9 9 19.5t6 21.5Zm-159-93q10-4 20-6t21-2q11 0 21 2t20 6l5-44q2-18-12.5-31T480-840q-19 0-33.5 13T434-796l5 44Zm41 312q19 0 33.5-13t12.5-31l-5-44q-10 4-20 6t-21 2q-11 0-21-2t-20-6l-5 44q-2 18 12.5 31t33.5 13ZM362-659q2-11 6-21.5t9-19.5q5-9 12-17t15-15l-32-23q-5-4-11.5-6t-14.5-2q-19 0-32.5 13.5T300-717q0 13 7.5 24t19.5 17l35 17Zm-16 141q8 0 14-1.5t12-6.5l33-22q-8-7-15.5-15T377-580q-5-9-9-19.5t-6-21.5l-35 17q-12 6-19 17t-7 24q1 19 13.5 32t31.5 13Zm237-62Zm0-120Zm-103-60Zm0 240ZM377-700Zm0 120Z"/></svg>
    ),
    intercom: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M680-480v-152l-92 92-28-28 112-112-112-112 28-28 92 92v-152h20l114 116-86 84 86 86-114 114h-20Zm40-76 38-38-38-38v76Zm0-172 38-36-38-38v74Zm78 608q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg>
    ),
    emergency_exit: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M80-200v-80h240v-240h240v-240h320v80H640v240H400v240H80Z"/></svg>
    ),
    fire_safety: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M279-240v-241l10-39h380l10 39v241H279Zm81-200v120h240v-120H360Zm147.5-292.5Q519-744 519-761t-11.5-28.5Q496-801 479-801t-28.5 11.5Q439-778 439-761t11.5 28.5Q462-721 479-721t28.5-11.5ZM640-738v-46l-42 8q1 4 1 7.5v15q0 3.5-1 7.5l42 8ZM279-481q0-63 35-113t91-72q-11-8-19.5-18.5T371-708l-171-33v-40l171-33q15-30 43.5-49t64.5-19q23 0 44 9t37 23l160-31v240l-160-31q-2 2-3.5 3t-3.5 3q56 22 91 72t35 113h-79q0-50-35-84.5T480-600q-50 0-85 34.5T360-481h-81Zm80 401q-33 0-56.5-23.5T279-160v-80h81v80h240v-80h79v80q0 33-23.5 56.5T599-80H359Z"/></svg>
    ),
    tennis_court: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="m137-160-57-56 164-164q31-31 42.5-77.5T298-600q0-58 26-114t74-104q91-91 201-103t181 61q72 72 60 182T738-478q-48 48-104 74t-114 26q-97 0-142 11t-77 43L137-160Zm275-334q47 46 127 34t143-75q64-64 76.5-143.5T724-803q-48-48-125.5-36T456-763q-63 63-76.5 142.5T412-494ZM607-87q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113T833-87q-47 47-113 47T607-87Zm169.5-56.5Q800-167 800-200t-23.5-56.5Q753-280 720-280t-56.5 23.5Q640-233 640-200t23.5 56.5Q687-120 720-120t56.5-23.5ZM720-200Z"/></svg>
    ),
    cricket: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M600-392 488-280q-12 12-28 12t-28-12L92-620q-12-12-12-27t12-27l112-112q12-12 29-12t29 12l338 338q12 12 12 28t-12 28Zm-140 28 56-56-284-284-56 56 284 284ZM744-80 574-250l56-56 170 170-56 56ZM641-641q-41-41-41-99t41-99q41-41 99-41t99 41q41 41 41 99t-41 99q-41 41-99 41t-99-41Zm141.5-56.5Q800-715 800-740t-17.5-42.5Q765-800 740-800t-42.5 17.5Q680-765 680-740t17.5 42.5Q715-680 740-680t42.5-17.5ZM740-740ZM346-534Z"/></svg>
    ),
    yoga_studio: (
      <svg xmlns="http://www.w3.org/2000/svg" height={`${size}px`} viewBox="0 -960 960 960" width={`${size}px`} fill="currentColor"><path d="M272-160q-30 0-51-21t-21-51q0-21 12-39.5t32-26.5l156-62v-90q-54 63-125.5 96.5T120-320v-80q68 0 123.5-28T344-508l54-64q12-14 28-21t34-7h40q18 0 34 7t28 21l54 64q45 52 100.5 80T840-400v80q-83 0-154.5-33.5T560-450v90l156 62q20 8 32 26.5t12 39.5q0 30-21 51t-51 21H400v-20q0-26 17-43t43-17h120q9 0 14.5-5.5T600-260q0-9-5.5-14.5T580-280H460q-42 0-71 29t-29 71v20h-88Zm151.5-503.5Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Z"/></svg>
    ),
  };
  return icons[type] || null;
};

export default function AmenitiesDisplay({ amenities }) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  const amenityMap = {
    'Power Back Up': 'power_backup',
    'Conference Room': 'conference_room',
    'Guest Accommodation': 'guest_accommodation',
    'Retail Shops': 'retail_shops',
    'Laundry Service': 'laundry',
    'Waste Disposal': 'waste_disposal',
    'Lift/Elevator': 'lift',
    'Reserved Parking': 'reserved_parking',
    'Service/Goods Lift': 'service_lift',
    'Visitor Parking': 'visitor_parking',
    'Maintenance Staff': 'maintenance_staff',
    'Swimming Pool': 'swimming_pool',
    'Gym/Fitness Center': 'gym',
    'Garden/Landscape': 'garden',
    'Playground': 'playground',
    'Community Hall': 'community_hall',
    'Reading Room/Library': 'reading_room',
    'Green Space': 'green_space',
    'Solar Power': 'solar_power',
    'Rainwater Harvesting': 'rainwater_harvesting',
    'Air Quality Monitor': 'air_quality',
    'Tree Cover': 'tree_cover',
    'CCTV Camera': 'cctv',
    '24/7 Security Staff': 'security_staff',
    'Gate Entry/Access Control': 'gate_entry',
    'Intercom System': 'intercom',
    'Fire Safety System': 'fire_safety',
    'Emergency Exit': 'emergency_exit',
    'Tennis Court': 'tennis_court',
    'Badminton Court': 'badminton',
    'Basketball Court': 'basketball',
    'Cricket Pitch': 'cricket',
    'Yoga Studio': 'yoga_studio',
  };

  return (
    <div className={styles.amenitiesDisplay}>
      <h4 className={styles.title}>🏠 Amenities</h4>
      <div className={styles.grid}>
        {amenities.map((amenity, idx) => {
          const iconType = amenityMap[amenity] || 'power_backup';
          return (
            <div key={idx} className={styles.amenityItem}>
              <div className={styles.icon}>
                <IconSVG type={iconType} size={16} />
              </div>
              <span className={styles.name}>{amenity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
