const About = ()=>{
    return(
        <main className="about-page">
            <header className="about-intro">
                <p className="about-kicker">THE PROJECT</p>
                <h1>Built with purpose. Ready to grow.</h1>
                <p>
                    Business Intelligence is a project by Wilson Marunda, built to help businesses
                    discover local opportunities and make outreach more focused.
                </p>
            </header>

            <section className="about-section">
                <div className="about-section-heading">
                    <span>01</span>
                    <h2>Background</h2>
                </div>
                <div className="about-section-copy">
                    <p>
                        I am Wilson Marunda, a software engineering student learning by building
                        practical products. This is one of the projects I am genuinely proud to
                        finish and share. I have often started projects and left them unfinished;
                        completing and publishing this one is an important step for me.
                    </p>
                    <p>
                        I hope people will try it, share feedback, and support its growth as I keep
                        improving it.
                    </p>
                </div>
            </section>

            <section className="about-section">
                <div className="about-section-heading">
                    <span>02</span>
                    <h2>What it does</h2>
                </div>
                <div className="about-section-copy">
                    <p>
                        The project helps people find businesses by location and category, then
                        explore useful details for potential business-to-business outreach.
                    </p>
                    <p>
                        The current version is a starting point. I wanted to complete the core
                        experience and put it out in the world before expanding it further.
                    </p>
                </div>
            </section>

            <section className="about-section">
                <div className="about-section-heading">
                    <span>03</span>
                    <h2>What's next</h2>
                </div>
                <div className="about-section-copy">
                    <p>
                        A future direction is voice agents that can automatically call leads and
                        help move them toward a sale based on what a business wants to advertise.
                        I also want to explore email marketing workflows for B2B businesses.
                    </p>
                    <p>
                        Over time, I plan to connect more API sources to broaden the information
                        available. These are future goals, and I will build toward them in stages.
                    </p>
                </div>
            </section>

            <section className="about-section about-contact">
                <div className="about-section-heading">
                    <span>04</span>
                    <h2>Get in touch</h2>
                </div>
                <div className="about-section-copy">
                    <p>Interested in the project, have feedback, or looking to hire?</p>
                    <div className="about-email-list">
                        <a href="mailto:wilsonmarundaa@gmail.com">wilsonmarundaa@gmail.com</a>
                        <a href="mailto:wilsonsaha2002@gmail.com">wilsonsaha2002@gmail.com</a>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default About