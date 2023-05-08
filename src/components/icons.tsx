import type { ComponentProps } from "react";

export const ReloadIcon = (props: ComponentProps<"svg">) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
		/>
	</svg>
);

export const LogoIcon = (props: ComponentProps<"svg">) => (
	<svg viewBox="0 0 177 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M42.6875 26.1719H33.5469C32.9948 26.1719 32.5781 26.3125 32.2969 26.5938C32.0156 26.8646 31.875 27.2656 31.875 27.7969V39H27.8125V27.7969C27.8125 27.099 27.901 26.474 28.0781 25.9219C28.2552 25.3698 28.4896 24.8854 28.7812 24.4688C29.0833 24.0417 29.4271 23.6823 29.8125 23.3906C30.1979 23.0885 30.599 22.8438 31.0156 22.6562C31.4427 22.4688 31.8698 22.3333 32.2969 22.25C32.7344 22.1562 33.1406 22.1094 33.5156 22.1094H42.6875V26.1719ZM49.5 18.6406H45.4375V14.9688H49.5V18.6406ZM49.5 39H45.4375V22.1094H49.5V39ZM68.4844 39H64.4219V27.7969C64.4219 27.2656 64.2812 26.8646 64 26.5938C63.7188 26.3125 63.3021 26.1719 62.75 26.1719H57.4688V39H53.4062V24.125C53.4062 23.8438 53.4583 23.5833 53.5625 23.3438C53.6667 23.0938 53.8125 22.8802 54 22.7031C54.1875 22.5156 54.4062 22.3698 54.6562 22.2656C54.9062 22.1615 55.1719 22.1094 55.4531 22.1094H62.7812C63.3438 22.1094 63.9479 22.2083 64.5938 22.4062C65.2396 22.6042 65.8542 22.9219 66.4375 23.3594V22.1094H71.9375C72.3229 22.1094 72.7292 22.1562 73.1562 22.25C73.5833 22.3333 74.0052 22.4688 74.4219 22.6562C74.849 22.8438 75.2552 23.0885 75.6406 23.3906C76.026 23.6823 76.3646 24.0417 76.6562 24.4688C76.9479 24.8854 77.1823 25.3698 77.3594 25.9219C77.5365 26.474 77.625 27.099 77.625 27.7969V39H73.5625V27.7969C73.5625 27.2656 73.4271 26.8646 73.1562 26.5938C72.8958 26.3125 72.4896 26.1719 71.9375 26.1719H68.2812C68.4167 26.6719 68.4844 27.2135 68.4844 27.7969V39ZM99.5469 27.7031C99.5469 28.2656 99.4479 28.875 99.25 29.5312C99.0521 30.1771 98.7292 30.7812 98.2812 31.3438C97.8438 31.8958 97.2656 32.3594 96.5469 32.7344C95.8385 33.1094 94.974 33.2969 93.9531 33.2969H86.625V29.4375H93.9531C94.5052 29.4375 94.9323 29.2708 95.2344 28.9375C95.5365 28.5938 95.6875 28.1719 95.6875 27.6719C95.6875 27.1406 95.5156 26.724 95.1719 26.4219C94.8385 26.1198 94.4323 25.9688 93.9531 25.9688H86.625C86.0729 25.9688 85.6458 26.1406 85.3438 26.4844C85.0417 26.8177 84.8906 27.2344 84.8906 27.7344V33.4062C84.8906 33.9479 85.0573 34.3698 85.3906 34.6719C85.7344 34.974 86.1562 35.125 86.6562 35.125H93.9531V39H86.625C86.0625 39 85.4531 38.901 84.7969 38.7031C84.151 38.5052 83.5469 38.1875 82.9844 37.75C82.4323 37.3021 81.9688 36.724 81.5938 36.0156C81.2188 35.2969 81.0312 34.4271 81.0312 33.4062V27.7031C81.0312 27.1406 81.1302 26.5365 81.3281 25.8906C81.526 25.2344 81.8438 24.6302 82.2812 24.0781C82.7292 23.5156 83.3073 23.0469 84.0156 22.6719C84.7344 22.2969 85.6042 22.1094 86.625 22.1094H93.9531C94.5156 22.1094 95.1198 22.2083 95.7656 22.4062C96.4219 22.6042 97.026 22.9271 97.5781 23.375C98.1406 23.8125 98.6094 24.3906 98.9844 25.1094C99.3594 25.8177 99.5469 26.6823 99.5469 27.7031ZM122.797 39H108.141C107.766 39 107.359 38.9583 106.922 38.875C106.495 38.7812 106.068 38.6406 105.641 38.4531C105.224 38.2656 104.823 38.026 104.438 37.7344C104.052 37.4323 103.708 37.0729 103.406 36.6562C103.115 36.2292 102.88 35.7396 102.703 35.1875C102.526 34.625 102.438 33.9948 102.438 33.2969V22.2969C102.438 21.9219 102.479 21.5208 102.562 21.0938C102.656 20.6562 102.797 20.2292 102.984 19.8125C103.172 19.3854 103.417 18.9792 103.719 18.5938C104.021 18.2083 104.38 17.8698 104.797 17.5781C105.224 17.276 105.714 17.0365 106.266 16.8594C106.818 16.6823 107.443 16.5938 108.141 16.5938H122.797V20.6562H108.141C107.609 20.6562 107.203 20.7969 106.922 21.0781C106.641 21.3594 106.5 21.776 106.5 22.3281V33.2969C106.5 33.8177 106.641 34.224 106.922 34.5156C107.214 34.7969 107.62 34.9375 108.141 34.9375H122.797V39ZM148.969 25.9688C148.969 26.8958 148.854 27.724 148.625 28.4531C148.396 29.1823 148.083 29.8281 147.688 30.3906C147.302 30.9427 146.854 31.4167 146.344 31.8125C145.833 32.2083 145.297 32.5312 144.734 32.7812C144.182 33.0312 143.62 33.2135 143.047 33.3281C142.484 33.4427 141.953 33.5 141.453 33.5H132.266V29.4375H141.453C141.974 29.3958 142.443 29.2917 142.859 29.125C143.286 28.9479 143.651 28.7135 143.953 28.4219C144.255 28.1302 144.49 27.7812 144.656 27.375C144.823 26.9583 144.906 26.4896 144.906 25.9688V24.125C144.854 23.6146 144.745 23.1458 144.578 22.7188C144.411 22.2917 144.182 21.9271 143.891 21.625C143.609 21.3229 143.266 21.0885 142.859 20.9219C142.453 20.7448 141.984 20.6562 141.453 20.6562H132.297C131.755 20.6562 131.344 20.7969 131.062 21.0781C130.781 21.3594 130.641 21.7656 130.641 22.2969V39H126.578V22.2969C126.578 21.2552 126.766 20.3698 127.141 19.6406C127.526 18.9115 128 18.3229 128.562 17.875C129.135 17.4271 129.755 17.1042 130.422 16.9062C131.089 16.6979 131.703 16.5938 132.266 16.5938H141.453C142.37 16.5938 143.193 16.7135 143.922 16.9531C144.651 17.1823 145.292 17.4948 145.844 17.8906C146.406 18.276 146.88 18.724 147.266 19.2344C147.661 19.7448 147.984 20.2812 148.234 20.8438C148.495 21.3958 148.682 21.9583 148.797 22.5312C148.911 23.0938 148.969 23.625 148.969 24.125V25.9688ZM174.406 36.9531C174.406 37.2448 174.354 37.5156 174.25 37.7656C174.146 38.0156 174 38.2344 173.812 38.4219C173.625 38.599 173.406 38.7396 173.156 38.8438C172.906 38.9479 172.641 39 172.359 39H163.203C162.339 39 161.464 38.9062 160.578 38.7188C159.693 38.5312 158.833 38.2448 158 37.8594C157.177 37.4635 156.401 36.9635 155.672 36.3594C154.943 35.7552 154.302 35.0417 153.75 34.2188C153.208 33.3854 152.781 32.4375 152.469 31.375C152.156 30.3021 152 29.1094 152 27.7969V16.5938H156.062V27.7969C156.062 28.9427 156.219 29.9115 156.531 30.7031C156.854 31.4948 157.26 32.1562 157.75 32.6875C158.24 33.2188 158.776 33.6354 159.359 33.9375C159.943 34.2396 160.495 34.4635 161.016 34.6094C161.547 34.7552 162.01 34.849 162.406 34.8906C162.812 34.9219 163.078 34.9375 163.203 34.9375H170.344V16.5938H174.406V36.9531Z"
			fill="#fff"
		/>
		<path
			d="M0.5 33.2694C0.5 33.42 0.567892 33.5626 0.68481 33.6576L1 33.2694L0.684822 33.6576L0.684875 33.6576L0.685103 33.6578L0.686042 33.6586L0.689827 33.6616L0.704833 33.6738L0.763015 33.7212L0.979473 33.8978C1.16349 34.0482 1.42042 34.2588 1.712 34.4995C2.29605 34.9815 3.01576 35.5816 3.56694 36.0601C4.4582 36.8339 5.63581 37.6766 6.58035 38.32C7.05467 38.6431 7.47416 38.9186 7.77521 39.1135C7.92578 39.2109 8.04685 39.2883 8.13049 39.3414L8.2269 39.4024L8.25222 39.4183L8.25883 39.4224L8.26058 39.4235L8.26107 39.4238L8.26121 39.4239L8.52632 39L8.26129 39.424C8.41542 39.5203 8.6097 39.5254 8.76869 39.4373C8.92767 39.3492 9.02632 39.1818 9.02632 39V2.80908C9.02632 2.62167 8.92151 2.44999 8.75482 2.36435C8.58812 2.2787 8.38753 2.29347 8.23517 2.4026L8.52632 2.80908C8.23517 2.4026 8.23511 2.40264 8.23504 2.40269L8.23481 2.40285L8.23404 2.40341L8.23123 2.40542L8.22064 2.41304L8.1801 2.44235C8.14466 2.46805 8.09265 2.50592 8.02563 2.55516C7.89159 2.65363 7.69745 2.7976 7.45567 2.98058C6.97223 3.34645 6.2977 3.86877 5.53197 4.4956C4.00459 5.7459 2.0979 7.42528 0.623259 9.11528C0.543788 9.20635 0.5 9.32314 0.5 9.44401V33.2694Z"
			fill="#2B99D8"
			strokeLinejoin="round"
		/>
		<path
			d="M14.8947 1L15.0393 0.521342C14.8878 0.475613 14.7236 0.504262 14.5966 0.598589C14.4696 0.692916 14.3947 0.841791 14.3947 1V28.746C14.3947 28.9059 14.4712 29.0561 14.6003 29.1502C14.7295 29.2443 14.8959 29.271 15.0481 29.222L14.8947 28.746C15.0481 29.222 15.0481 29.2219 15.0482 29.2219L15.0484 29.2219L15.049 29.2217L15.0509 29.221L15.0577 29.2188L15.0825 29.2107C15.104 29.2036 15.1353 29.1931 15.1753 29.1795C15.2552 29.1523 15.3704 29.1123 15.5134 29.0606C15.7991 28.9572 16.197 28.8062 16.6474 28.6157C17.5398 28.238 18.671 27.691 19.5388 27.0335C20.3563 26.4141 21.3246 25.4019 22.0726 24.5675C22.4504 24.146 22.779 23.7619 23.0131 23.4832C23.1302 23.3437 23.2238 23.2305 23.2884 23.1518C23.3207 23.1125 23.3457 23.0818 23.3628 23.0608L23.3823 23.0367L23.3874 23.0304L23.3888 23.0287L23.3892 23.0282L23.3893 23.0281C23.3893 23.028 23.3894 23.028 23 22.7143L23.3894 23.028C23.461 22.9391 23.5 22.8284 23.5 22.7143V7.03175C23.5 6.98004 23.492 6.92864 23.4762 6.87939C23.3776 6.57121 23.1697 6.23872 22.924 5.915C22.6718 5.58272 22.3522 5.2244 21.9954 4.86128C21.2814 4.13474 20.3946 3.36523 19.54 2.71353C18.6217 2.01325 17.4908 1.46606 16.607 1.0974C16.1617 0.911694 15.7722 0.768431 15.4933 0.671381C15.3537 0.622817 15.2416 0.585722 15.1637 0.560573C15.1248 0.547996 15.0943 0.538399 15.0733 0.531842L15.0489 0.524292L15.0422 0.52224L15.0403 0.521646L15.0397 0.521458L15.0394 0.521391C15.0393 0.521365 15.0393 0.521342 14.8947 1Z"
			fill="#7E2EFF"
			strokeLinejoin="round"
		/>
	</svg>
);

export const LogoIconBlack = (props: ComponentProps<"svg">) => (
	<svg viewBox="0 0 177 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path
			d="M42.6875 26.1719H33.5469C32.9948 26.1719 32.5781 26.3125 32.2969 26.5938C32.0156 26.8646 31.875 27.2656 31.875 27.7969V39H27.8125V27.7969C27.8125 27.099 27.901 26.474 28.0781 25.9219C28.2552 25.3698 28.4896 24.8854 28.7812 24.4688C29.0833 24.0417 29.4271 23.6823 29.8125 23.3906C30.1979 23.0885 30.599 22.8438 31.0156 22.6562C31.4427 22.4688 31.8698 22.3333 32.2969 22.25C32.7344 22.1562 33.1406 22.1094 33.5156 22.1094H42.6875V26.1719ZM49.5 18.6406H45.4375V14.9688H49.5V18.6406ZM49.5 39H45.4375V22.1094H49.5V39ZM68.4844 39H64.4219V27.7969C64.4219 27.2656 64.2812 26.8646 64 26.5938C63.7188 26.3125 63.3021 26.1719 62.75 26.1719H57.4688V39H53.4062V24.125C53.4062 23.8438 53.4583 23.5833 53.5625 23.3438C53.6667 23.0938 53.8125 22.8802 54 22.7031C54.1875 22.5156 54.4062 22.3698 54.6562 22.2656C54.9062 22.1615 55.1719 22.1094 55.4531 22.1094H62.7812C63.3438 22.1094 63.9479 22.2083 64.5938 22.4062C65.2396 22.6042 65.8542 22.9219 66.4375 23.3594V22.1094H71.9375C72.3229 22.1094 72.7292 22.1562 73.1562 22.25C73.5833 22.3333 74.0052 22.4688 74.4219 22.6562C74.849 22.8438 75.2552 23.0885 75.6406 23.3906C76.026 23.6823 76.3646 24.0417 76.6562 24.4688C76.9479 24.8854 77.1823 25.3698 77.3594 25.9219C77.5365 26.474 77.625 27.099 77.625 27.7969V39H73.5625V27.7969C73.5625 27.2656 73.4271 26.8646 73.1562 26.5938C72.8958 26.3125 72.4896 26.1719 71.9375 26.1719H68.2812C68.4167 26.6719 68.4844 27.2135 68.4844 27.7969V39ZM99.5469 27.7031C99.5469 28.2656 99.4479 28.875 99.25 29.5312C99.0521 30.1771 98.7292 30.7812 98.2812 31.3438C97.8438 31.8958 97.2656 32.3594 96.5469 32.7344C95.8385 33.1094 94.974 33.2969 93.9531 33.2969H86.625V29.4375H93.9531C94.5052 29.4375 94.9323 29.2708 95.2344 28.9375C95.5365 28.5938 95.6875 28.1719 95.6875 27.6719C95.6875 27.1406 95.5156 26.724 95.1719 26.4219C94.8385 26.1198 94.4323 25.9688 93.9531 25.9688H86.625C86.0729 25.9688 85.6458 26.1406 85.3438 26.4844C85.0417 26.8177 84.8906 27.2344 84.8906 27.7344V33.4062C84.8906 33.9479 85.0573 34.3698 85.3906 34.6719C85.7344 34.974 86.1562 35.125 86.6562 35.125H93.9531V39H86.625C86.0625 39 85.4531 38.901 84.7969 38.7031C84.151 38.5052 83.5469 38.1875 82.9844 37.75C82.4323 37.3021 81.9688 36.724 81.5938 36.0156C81.2188 35.2969 81.0312 34.4271 81.0312 33.4062V27.7031C81.0312 27.1406 81.1302 26.5365 81.3281 25.8906C81.526 25.2344 81.8438 24.6302 82.2812 24.0781C82.7292 23.5156 83.3073 23.0469 84.0156 22.6719C84.7344 22.2969 85.6042 22.1094 86.625 22.1094H93.9531C94.5156 22.1094 95.1198 22.2083 95.7656 22.4062C96.4219 22.6042 97.026 22.9271 97.5781 23.375C98.1406 23.8125 98.6094 24.3906 98.9844 25.1094C99.3594 25.8177 99.5469 26.6823 99.5469 27.7031ZM122.797 39H108.141C107.766 39 107.359 38.9583 106.922 38.875C106.495 38.7812 106.068 38.6406 105.641 38.4531C105.224 38.2656 104.823 38.026 104.438 37.7344C104.052 37.4323 103.708 37.0729 103.406 36.6562C103.115 36.2292 102.88 35.7396 102.703 35.1875C102.526 34.625 102.438 33.9948 102.438 33.2969V22.2969C102.438 21.9219 102.479 21.5208 102.562 21.0938C102.656 20.6562 102.797 20.2292 102.984 19.8125C103.172 19.3854 103.417 18.9792 103.719 18.5938C104.021 18.2083 104.38 17.8698 104.797 17.5781C105.224 17.276 105.714 17.0365 106.266 16.8594C106.818 16.6823 107.443 16.5938 108.141 16.5938H122.797V20.6562H108.141C107.609 20.6562 107.203 20.7969 106.922 21.0781C106.641 21.3594 106.5 21.776 106.5 22.3281V33.2969C106.5 33.8177 106.641 34.224 106.922 34.5156C107.214 34.7969 107.62 34.9375 108.141 34.9375H122.797V39ZM148.969 25.9688C148.969 26.8958 148.854 27.724 148.625 28.4531C148.396 29.1823 148.083 29.8281 147.688 30.3906C147.302 30.9427 146.854 31.4167 146.344 31.8125C145.833 32.2083 145.297 32.5312 144.734 32.7812C144.182 33.0312 143.62 33.2135 143.047 33.3281C142.484 33.4427 141.953 33.5 141.453 33.5H132.266V29.4375H141.453C141.974 29.3958 142.443 29.2917 142.859 29.125C143.286 28.9479 143.651 28.7135 143.953 28.4219C144.255 28.1302 144.49 27.7812 144.656 27.375C144.823 26.9583 144.906 26.4896 144.906 25.9688V24.125C144.854 23.6146 144.745 23.1458 144.578 22.7188C144.411 22.2917 144.182 21.9271 143.891 21.625C143.609 21.3229 143.266 21.0885 142.859 20.9219C142.453 20.7448 141.984 20.6562 141.453 20.6562H132.297C131.755 20.6562 131.344 20.7969 131.062 21.0781C130.781 21.3594 130.641 21.7656 130.641 22.2969V39H126.578V22.2969C126.578 21.2552 126.766 20.3698 127.141 19.6406C127.526 18.9115 128 18.3229 128.562 17.875C129.135 17.4271 129.755 17.1042 130.422 16.9062C131.089 16.6979 131.703 16.5938 132.266 16.5938H141.453C142.37 16.5938 143.193 16.7135 143.922 16.9531C144.651 17.1823 145.292 17.4948 145.844 17.8906C146.406 18.276 146.88 18.724 147.266 19.2344C147.661 19.7448 147.984 20.2812 148.234 20.8438C148.495 21.3958 148.682 21.9583 148.797 22.5312C148.911 23.0938 148.969 23.625 148.969 24.125V25.9688ZM174.406 36.9531C174.406 37.2448 174.354 37.5156 174.25 37.7656C174.146 38.0156 174 38.2344 173.812 38.4219C173.625 38.599 173.406 38.7396 173.156 38.8438C172.906 38.9479 172.641 39 172.359 39H163.203C162.339 39 161.464 38.9062 160.578 38.7188C159.693 38.5312 158.833 38.2448 158 37.8594C157.177 37.4635 156.401 36.9635 155.672 36.3594C154.943 35.7552 154.302 35.0417 153.75 34.2188C153.208 33.3854 152.781 32.4375 152.469 31.375C152.156 30.3021 152 29.1094 152 27.7969V16.5938H156.062V27.7969C156.062 28.9427 156.219 29.9115 156.531 30.7031C156.854 31.4948 157.26 32.1562 157.75 32.6875C158.24 33.2188 158.776 33.6354 159.359 33.9375C159.943 34.2396 160.495 34.4635 161.016 34.6094C161.547 34.7552 162.01 34.849 162.406 34.8906C162.812 34.9219 163.078 34.9375 163.203 34.9375H170.344V16.5938H174.406V36.9531Z"
			fill="#333"
		/>
		<path
			d="M0.5 33.2694C0.5 33.42 0.567892 33.5626 0.68481 33.6576L1 33.2694L0.684822 33.6576L0.684875 33.6576L0.685103 33.6578L0.686042 33.6586L0.689827 33.6616L0.704833 33.6738L0.763015 33.7212L0.979473 33.8978C1.16349 34.0482 1.42042 34.2588 1.712 34.4995C2.29605 34.9815 3.01576 35.5816 3.56694 36.0601C4.4582 36.8339 5.63581 37.6766 6.58035 38.32C7.05467 38.6431 7.47416 38.9186 7.77521 39.1135C7.92578 39.2109 8.04685 39.2883 8.13049 39.3414L8.2269 39.4024L8.25222 39.4183L8.25883 39.4224L8.26058 39.4235L8.26107 39.4238L8.26121 39.4239L8.52632 39L8.26129 39.424C8.41542 39.5203 8.6097 39.5254 8.76869 39.4373C8.92767 39.3492 9.02632 39.1818 9.02632 39V2.80908C9.02632 2.62167 8.92151 2.44999 8.75482 2.36435C8.58812 2.2787 8.38753 2.29347 8.23517 2.4026L8.52632 2.80908C8.23517 2.4026 8.23511 2.40264 8.23504 2.40269L8.23481 2.40285L8.23404 2.40341L8.23123 2.40542L8.22064 2.41304L8.1801 2.44235C8.14466 2.46805 8.09265 2.50592 8.02563 2.55516C7.89159 2.65363 7.69745 2.7976 7.45567 2.98058C6.97223 3.34645 6.2977 3.86877 5.53197 4.4956C4.00459 5.7459 2.0979 7.42528 0.623259 9.11528C0.543788 9.20635 0.5 9.32314 0.5 9.44401V33.2694Z"
			fill="#2B99D8"
			strokeLinejoin="round"
		/>
		<path
			d="M14.8947 1L15.0393 0.521342C14.8878 0.475613 14.7236 0.504262 14.5966 0.598589C14.4696 0.692916 14.3947 0.841791 14.3947 1V28.746C14.3947 28.9059 14.4712 29.0561 14.6003 29.1502C14.7295 29.2443 14.8959 29.271 15.0481 29.222L14.8947 28.746C15.0481 29.222 15.0481 29.2219 15.0482 29.2219L15.0484 29.2219L15.049 29.2217L15.0509 29.221L15.0577 29.2188L15.0825 29.2107C15.104 29.2036 15.1353 29.1931 15.1753 29.1795C15.2552 29.1523 15.3704 29.1123 15.5134 29.0606C15.7991 28.9572 16.197 28.8062 16.6474 28.6157C17.5398 28.238 18.671 27.691 19.5388 27.0335C20.3563 26.4141 21.3246 25.4019 22.0726 24.5675C22.4504 24.146 22.779 23.7619 23.0131 23.4832C23.1302 23.3437 23.2238 23.2305 23.2884 23.1518C23.3207 23.1125 23.3457 23.0818 23.3628 23.0608L23.3823 23.0367L23.3874 23.0304L23.3888 23.0287L23.3892 23.0282L23.3893 23.0281C23.3893 23.028 23.3894 23.028 23 22.7143L23.3894 23.028C23.461 22.9391 23.5 22.8284 23.5 22.7143V7.03175C23.5 6.98004 23.492 6.92864 23.4762 6.87939C23.3776 6.57121 23.1697 6.23872 22.924 5.915C22.6718 5.58272 22.3522 5.2244 21.9954 4.86128C21.2814 4.13474 20.3946 3.36523 19.54 2.71353C18.6217 2.01325 17.4908 1.46606 16.607 1.0974C16.1617 0.911694 15.7722 0.768431 15.4933 0.671381C15.3537 0.622817 15.2416 0.585722 15.1637 0.560573C15.1248 0.547996 15.0943 0.538399 15.0733 0.531842L15.0489 0.524292L15.0422 0.52224L15.0403 0.521646L15.0397 0.521458L15.0394 0.521391C15.0393 0.521365 15.0393 0.521342 14.8947 1Z"
			fill="#7E2EFF"
			strokeLinejoin="round"
		/>
	</svg>
);
