import classes from './Home.module.scss';
// import HomeHeroBottom from '../assets/svg/HomeHeroBottom.svg';

function Home() {
    return <div className={classes.homeHeroContainer}>
        <div className={classes.homeHero}>

            <div className={classes.homeHeroWrap}>
                <div>
                    <h1>WORLD OF OCTA</h1>
                    <p>OCTA World, it is a parallel dimension with our earth. OCTA world ruled into 8 kingdoms and underneath this world is inhabited by many kind of monsters which, seek to come out to conquer to OCTA world. To protect 8 kingdoms Supreme wizard have to build "The Gate" to vanish monsters to other dimensions. Unfortunately, the dimensions they were sent is the Earth. For all responsibilities Supreme wizard has created holy weapons and transfer warriors to save the Earth. However, these warriors from OCTA world to appear on the Earth and hunt those monsters have to merge with heroes from the Earth. The Supreme wizard will prepare the holy weapons for the chosen one there is the only way to protect our planet.</p>
                </div>
            </div>

        </div>        

    </div>
}

export default Home;