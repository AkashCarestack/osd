import Section from "~/components/structure/Section";


{/* <script>
    import Section from "$lib/components/layout/Section.svelte";
    import Markdown from "svelte-exmarkdown";

    let md = " # h1";
</script> */}


function BaaPage() {
    return (
        <div className="w-full flex justify-center border py-40 px-8">
            <Section className=" w-full md:max-w-5xl flex flex-col">
                <div className="flex flex-col text-center justify-center mb-10">
                    <h1 className="text-4xl font-semibold">
                        HIPAA Business Associate Agreement
                    </h1>
                </div>

                <div className="legal-content">
                    {/* <!-- <Markdown {md} />     --> */}
                    <p className="legal__text">
                        If Customer is a Covered Entity and includes Protected Health
                        Information in Customer Data or otherwise provide any Protected
                        Health Information to VoiceStack or via the Services, execution
                        of an Order Form that references to the Service Agreement (as
                        defined below) will and hereby does incorporate the terms of
                        this HIPAA Business Associate Agreement (“BA Agreement”) into
                        the Service Agreement by this reference.
                    </p>
                    <p className="legal__text">
                        WHEREAS, Business Associate and Covered Entity have entered into
                        the Services Agreement. In connection with Business Associate’s
                        services, Business Associate and Covered Entity anticipate that
                        Business Associate will create or receive Protected Health
                        Information from and/or on behalf of Covered Entity, which
                        information is subject to protection under the Federal Health
                        Insurance Portability and Accountability Act of 1996, Pub. L.
                        No. 104191, as amended by the Health Information Technology for
                        Economic and Clinical Health Act, Title XIII of the American
                        Recovery
                        <br />
                        and Reinvestment Act of 2009 (the “HITECH Act”), and related regulations
                        promulgated by the Secretary (together “HIPAA”).
                    </p>
                    <p className="legal__text">
                        WHEREAS, in light of the foregoing and the requirements of
                        HIPAA, Business Associate and Covered Entity agree to be bound
                        by the following terms and conditions.
                    </p>
                    <p className="legal__text">
                        NOW, THEREFORE, for good and valuable consideration, the receipt
                        and sufficiency of which is hereby acknowledged, the parties
                        agree as follows:
                    </p>
                    <h2 className="legal__section-title">1. Definitions.</h2>
                    <h3 className="legal__section-sub-title">
                        1.1 Capitalized terms used, but not otherwise defined, in this
                        BA Agreement shall have the same meaning given to those terms
                    </h3>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            (i) by HIPAA as in effect or as amended from time to time,
                            or
                        </li>
                        <li className="legal__list-item">
                            (ii) if (i) is not applicable, by the Service Agreement.
                        </li>
                    </ul>
                    <h3 className="legal__section-sub-title">
                        1.2 “Services Agreement” shall mean any present or future
                        agreements, either written or oral, between Covered Entity and
                        Business Associate under which Business Associate provides
                        services to Covered Entity which involve the use or disclosure
                        of Protected Health Information.
                    </h3>
                    <h2 className="legal__section-title">
                        2. Obligations and Activities of Business Associate.
                    </h2>
                    <h3 className="legal__section-sub-title">2.1 Use and Disclosure.</h3>
                    <p className="legal__text">
                        If Protected Health Information is created by or disclosed to
                        Business Associate, Business Associate agrees not to use or
                        disclose Protected Health Information other than as permitted or
                        required by the Services Agreement, this BA Agreement or as
                        Required by Law. Business Associate shall comply with the
                        provisions of this BA Agreement relating to privacy and security
                        of Protected Health Information and all present and future
                        provisions of HIPAA that relate to the privacy and security of
                        Protected Health Information and that are applicable to
                        “business associates,” as that term is defined in HIPAA.
                    </p>
                    <h3 className="legal__section-sub-title">
                        2.2 Appropriate Safeguards.
                    </h3>
                    <p className="legal-text">
                        Business Associate agrees to use appropriate safeguards to
                        prevent the use or disclosure of the Protected Health
                        Information other than as provided for by this BA Agreement.
                        Without limiting the generality of the foregoing sentence,
                        Business Associate will:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            (a) Implement administrative, organizational, physical, and
                            technical safeguards that reasonably and appropriately
                            protect the confidentiality, integrity and availability of
                            Electronic Protected Health Information that it creates,
                            receives, maintains or transmits on behalf of the Covered
                            Entity as required by the Security Rule;
                        </li>
                        <li className="legal__list-item">
                            (b) Report to Covered Entity any Security Incident involving
                            Electronic Protected Health Information of which Business
                            Associate becomes aware. Any actual, successful Security
                            Incident will be reported to Covered Entity in writing
                            without unreasonable delay. Any attempted, unsuccessful
                            Security Incident of which Business Associate becomes aware
                            will be reported to Covered Entity orally or in writing on a
                            reasonable basis, as requested by Covered Entity. If HIPAA
                            is amended to remove the requirement to report unsuccessful
                            attempts at unauthorized access, the requirement hereunder
                            to report such unsuccessful attempts will no longer apply as
                            of the effective date of the amendment.
                        </li>
                        <li className="legal__list-item">
                            (c) Notify Covered Entity following the discovery of a
                            Breach of Unsecured Protected Health Information in
                            accordance with 45 C.F.R. § 164.410 without unreasonable
                            delay and in no case later than 60 days (or within any
                            shorter deadline imposed by applicable State law) after
                            discovery of the Breach. A Breach is considered “discovered”
                            as of the first day on which the Breach is known, or
                            reasonably should have been known, to Business Associate or
                            any employee, officer or agent of Business Associate, other
                            than the individual committing the Breach. Any notice of a
                            Security Incident or Breach of Unsecured Protected Health
                            Information shall include the identification of each
                            Individual whose Protected Health Information has been, or
                            is reasonably
                            <br />
                            believed by Business Associate to have been, accessed, acquired,
                            or disclosed during such Security Incident or Breach as well
                            as any other relevant information regarding the Security Incident
                            or Breach.
                        </li>
                    </ul>
                    <h3 className="legal__section-sub-title">2.3 Reporting.</h3>
                    <p className="legal__text">
                        Business Associate agrees to report, without unreasonable delay,
                        to Covered Entity any use or disclosure of Protected Health
                        Information by Business Associate or a third party to which
                        Business Associate disclosed Protected Health Information not
                        permitted by this BA Agreement of which Business Associate
                        becomes aware.
                    </p>
                    <h3 className="legal__section-sub-title">
                        2.4 Minimum Necessary Standard.
                    </h3>
                    <p className="legal__text">
                        To the extent required by the “minimum necessary” requirements
                        of HIPAA, Business Associate shall only request, use and
                        disclose the minimum amount of Protected Health Information
                        necessary to accomplish the purpose of the request, use or
                        disclosure.
                    </p>
                    <h3 className="legal__section-sub-title">2.5 Mitigation.</h3>
                    <p className="legal__text">
                        Business Associate agrees to take reasonable steps to mitigate,
                        to the extent practicable, any harmful effect that is known to
                        Business Associate of a use or disclosure of Protected Health
                        Information by Business Associate in violation of the
                        requirements of this BA Agreement (including, without
                        limitation, any Security Incident or Breach of <br /> Unsecured
                        Protected Health Information). Business Associate agrees to
                        reasonably cooperate and coordinate with Covered Entity in the
                        investigation of any violation of the requirements of this BA
                        Agreement and/or any Security Incident or Breach. Business
                        Associate shall also reasonably cooperate and coordinate with
                        Covered Entity in the <br /> preparation of any reports or notices
                        required to be made under HIPAA or any other Federal or State laws,
                        rules or regulations, to any Individual (entitled to notice in connection
                        with a Breach), regulatory body, or any third party, provided that
                        any such reports or notices shall be subject to the prior written
                        approval of Covered Entity.
                    </p>
                    <h3 className="legal__section-sub-title">2.6 Subcontractors.</h3>
                    <p className="legal__text">
                        Business Associate shall enter into a written agreement meeting
                        the requirements of 45 C.F.R. §§ 164.504(e) and 164.314(a)(2)
                        with each Subcontractor (including, without limitation, a
                        Subcontractor that is an agent under applicable law) that
                        creates, receives, maintains or transmits Protected Health
                        Information on behalf of Business Associate. Business Associate
                        shall ensure that the written agreement with each Subcontractor
                        obligates the Subcontractor to comply with restrictions and
                        conditions that are at least as restrictive as the restrictions
                        and <br /> conditions that apply to Business Associate through this
                        BA Agreement.
                    </p>
                    <h3 className="legal__section-sub-title">
                        2.7 Access to Designated Record Sets.
                    </h3>
                    <p className="legal__text">
                        To the extent that Business Associate maintains Protected Health
                        Information in a Designated Record Set, Business Associate
                        agrees to provide access, at the request of Covered Entity, and
                        in the time and manner designated by the Covered Entity, to
                        Protected Health Information in a Designated Record Set created
                        or received by Business Associate solely on behalf of Covered
                        Entity only, to Covered Entity or, as directed by Covered
                        Entity, to an Individual in order to meet the requirements under
                        HIPAA Regulations. If an Individual makes a request for access
                        to Protected Health Information directly to Business Associate,
                        Business Associate shall notify Covered Entity of the request
                        within ten (10) business days of such request. Covered Entity
                        shall have the sole responsibility to make decisions regarding
                        whether to approve a request for access to Protected Health
                        Information.
                    </p>
                    <h3 className="legal__section-sub-title">
                        2.8 Amendments to Designated Record Sets.
                    </h3>
                    <p className="legal__text">
                        To the extent that Business Associate maintains Protected Health
                        Information in a Designated Record Set, within thirty (30) days
                        of a receipt of a request from Covered Entity for the amendment
                        of an Individual’s Protected Health Information contained in
                        such Designated Record Set, Business Associate agrees to provide
                        such Protected Health Information to Covered Entity for
                        amendment and to incorporate any such amendment(s) to Protected
                        Health Information in the Designated Record Set maintained by
                        the Business Associate pursuant to HIPAA Regulations and <br /> in
                        the time and manner designated by the Covered Entity. If an Individual
                        makes a request for an amendment to Protected Health Information
                        directly to Business Associate, Business Associate shall notify Covered
                        Entity of the request within ten (10) business days of such request.
                        Covered Entity will have the sole responsibility to make decisions
                        regarding whether to approve a request for amendment to Protected
                        Health Information.
                    </p>
                    <h3 className="legal__section-sub-title">
                        2.9 Access to Books and Records.
                    </h3>
                    <p className="legal__text">
                        Business Associate agrees to make its internal practices, books,
                        and records relating to the use and disclosure of Protected
                        Health Information received from, or created or received by
                        Business Associate on behalf of, Covered Entity available to the
                        Secretary for purposes of the Secretary determining Covered
                        Entity’s and Business Associate’s compliance with the Privacy
                        Rule.
                    </p>
                    <h3 className="legal__section-sub-title">2.10 Accountings.</h3>
                    <p className="legal__text">
                        Business Associate agrees to, within thirty (30) days of request
                        for an accounting of disclosures of Protected Health Information
                        from Covered Entity, make available to Covered Entity such
                        information as is in Business Associate’s possession and as
                        would be required for Covered Entity to respond to a request by
                        an Individual for an accounting of disclosures of Protected
                        Health Information in accordance with HIPAA. If Business
                        Associate receives a request for an accounting directly from an
                        Individual, Business Associate shall forward such request to
                        Covered Entity within <br /> ten (10) business days. Covered Entity
                        shall have the sole responsibility to provide an accounting of disclosures.
                    </p>
                    <h2 className="legal__section-title">
                        3. Permitted Uses and Disclosures by Business Associate.
                    </h2>
                    <h3 className="legal__section-sub-title">3.1 Services Agreement.</h3>
                    <p className="legal__text">
                        Except as otherwise limited in this BA Agreement, Business
                        Associate may use or disclose Protected Health Information to
                        perform functions, activities, or services for, or on behalf of,
                        Covered Entity as specified in the Services Agreement, provided
                        that such use or disclosure would not violate HIPAA if done by
                        Covered Entity or the minimum necessary policies and procedures
                        of the Covered Entity.
                    </p>
                    <h3 className="legal__section-sub-title">
                        3.2 Use for Administration of Business Associate.
                    </h3>
                    <p className="legal__text">
                        Except as otherwise limited in this BA Agreement, Business
                        Associate may use Protected Health Information for the proper
                        management and administration of the Business Associate or to
                        carry out the legal responsibilities of the Business Associate.
                        Covered Entity acknowledges and agrees that proper management
                        and administration of Business Associate includes, without
                        limitation, modifications or upgrades to its software or
                        services, and development of new features or functionality
                        thereof, or new related product or services.
                    </p>
                    <h3 className="legal__section-sub-title">
                        3.3 Disclosure for Administration of Business Associate.
                    </h3>
                    <p className="legal__text">
                        Except as otherwise limited in this BA Agreement, Business
                        Associate may disclose Protected Health Information for the
                        proper management and administration of the Business Associate,
                        provided that
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            (i) disclosures are Required by Law, or
                        </li>
                        <li className="legal__list-item">
                            (ii) Business Associate obtains reasonable assurances from
                            the third party to whom the information is disclosed that
                            the third party will
                            <ul className="legal__list">
                                <li className="legal__list-item">
                                    (a) protect the confidentiality of the Protected
                                    Health Information, and
                                </li>
                                <li className="legal__list-item">
                                    (b) use or further disclose the Protected Health
                                    Information only as Required by Law or for the
                                    purpose for which it was disclosed to the third
                                    party.
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <h3 className="legal__section-sub-title">3.4 Data Aggregation.</h3>
                    <p className="legal__text">
                        Business Associate may use Protected Health Information to
                        provide Data Aggregation services relating to the Health Care
                        Operations of Covered Entity if required or permitted under this
                        Agreement or the Service Agreement.
                    </p>
                    <h3 className="legal__section-sub-title">
                        3.5 De-Identified Information.
                    </h3>
                    <p className="legal__text">
                        Business Associate may use Protected Health Information to
                        create de-identified health information in accordance with the
                        HIPAA de-identification requirements. Business Associate may
                        disclose de-identified health information for any purpose
                        permitted by law.
                    </p>
                    <h2 className="legal__section-title">
                        4. Obligations of the Covered Entity.
                    </h2>
                    <h3 className="legal__section-sub-title">
                        4.1 Permissible Requests by Covered Entity.
                    </h3>
                    <p className="legal__text">
                        Except as set forth in Section 3 of this BA Agreement, Covered
                        Entity shall not request Business Associate to use or disclose
                        Protected Health Information in any manner that would not be
                        permissible under the Privacy Rule if done by Covered Entity.
                    </p>

                    <h3 className="legal__section-sub-title">4.2 Minimum Necessary PHI.</h3>
                    <p className="legal__text">
                        When Covered Entity discloses Protected Health Information to
                        Business Associate, Covered Entity shall provide the minimum
                        amount of Protected Health Information necessary for the
                        accomplishment of Business Associate’s <br /> purpose.
                    </p>

                    <h3 className="legal__section-sub-title">
                        4.3 Permissions; Restrictions.
                    </h3>
                    <p className="legal__text">
                        Covered Entity warrants that it has obtained and will obtain any
                        consents, authorizations and/or other legal permissions required
                        under HIPAA and other applicable law for the disclosure of
                        Protected Health Information to Business Associate. Covered
                        Entity shall notify Business Associate of any changes in, or
                        revocation of, the permission by an Individual to use or
                        disclose his or her Protected Health Information, to the extent
                        that such changes may affect Business Associate’s use or
                        disclosure of Protected Health Information. Covered Entity shall
                        not agree to any restriction on the use or disclosure of
                        Protected Health Information under 45 C.F.R. § 164.522 that
                        restricts Business Associate’s use or disclosure of Protected
                        Health Information under this BA Agreement unless <br /> Business
                        Associate grants its written consent.
                    </p>

                    <h3 className="legal__section-sub-title">
                        4.4 Notice of Privacy Practices.
                    </h3>
                    <p className="legal__text">
                        Except as required under HIPAA or other applicable law, with
                        Business Associate’s consent or as set forth in the Services
                        Agreement, Covered Entity shall not include any limitation in
                        the Covered Entity’s notice of privacy practices that limits
                        Business Associate’s use or disclosure of Protected Health
                        Information under this BA Agreement.
                    </p>
                    <h2 className="legal__section-title">5. Term and Termination.</h2>
                    <h3 className="legal__section-sub-title">5.1 Term.</h3>
                    <p className="legal__text">
                        This BA Agreement shall be effective as of the date of this BA
                        Agreement and shall terminate when all of the Protected Health
                        Information provided by Covered Entity to Business Associate, or
                        created or received by Business Associate on behalf of Covered
                        Entity, is destroyed or returned to Covered Entity, or, if it is
                        infeasible to return or destroy Protected Health Information,
                        protections are extended to such information, in accordance with
                        the termination provisions in this Section.
                    </p>

                    <h3 className="legal__section-sub-title">
                        5.2 Termination Upon Breach.
                    </h3>
                    <p className="legal__text">
                        Any other provision of this BA Agreement notwithstanding, either
                        party (the “Non-Breaching Party”), upon knowledge of a material
                        breach by the other party (the “Breaching Party”), shall provide
                        an opportunity for the Breaching Party to cure the breach or end
                        the violation. If Breaching Party does not cure the breach or
                        end the violation within thirty (30) calendar days, the
                        Non-Breaching Party may terminate:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">(A) this BA Agreement; and</li>
                        <li className="legal__list-item">
                            (B) all of the provisions of the Services Agreement that
                            involve the use or disclosure of Protected Health
                            Information In the event that termination of this BA
                            Agreement is not feasible, in the Non-Breaching Party’s sole
                            discretion, the Non-Breaching Party has the right to report
                            the breach to the Secretary.
                        </li>
                    </ul>

                    <h3 className="legal__section-sub-title">5.3 Effect of Termination.</h3>
                    <p className="legal__text">
                        (a) Except as provided in Section 5(c)(ii), upon termination of
                        this BA Agreement, for any reason, Business Associate shall
                        return or destroy all Protected Health Information received from
                        Covered Entity, or created or received by Business Associate on
                        behalf of Covered Entity. This provision shall apply to
                        Protected Health Information that is in the possession of
                        subcontractors or agents of Business Associate. Business
                        Associate shall retain no copies of the Protected Health
                        Information.
                    </p>
                    <p className="legal__text">
                        (b) In the event that Business Associate reasonably determines
                        that returning or destroying the Protected Health Information is
                        infeasible, Business Associate shall extend the protections of
                        this BA Agreement to such Protected Health Information and limit
                        further uses and disclosures of such Protected Health
                        Information to those purposes that make the return or
                        destruction infeasible, for so long as Business Associate
                        maintains such Protected Health Information. Covered Entity
                        acknowledges and agrees that
                    </p>
                    <ul className="legal__list legal__list--space-left">
                        <li className="legal__list-item">
                            (i) it is infeasible for Business Associate to delete
                            Practice Protected Health Information from its backup tapes
                            or other backup systems and
                        </li>
                        <li className="legal__list-item">
                            (ii) it is infeasible for Business Associate to delete all
                            Practice Protected Health Information during an ongoing
                            investigation in connection with a Security Incident or
                            Breach of Unsecured Protected Health Information, and that
                            temporarily retaining certain Practice Protected Health
                            Information may be necessary for such investigation.
                        </li>
                    </ul>
                    <h2 className="legal__section-title">
                        6. Compliance with HIPAA Transaction Standards.
                    </h2>
                    <p className="legal__text">
                        When providing its services and/or products, Business Associate
                        shall comply with all applicable HIPAA standards and
                        requirements (including, without limitation, those specified in
                        45 CFR Part 162) with respect to the transmission of health
                        information in electronic form in connection with any
                        transaction for which the Secretary has adopted a standard under
                        HIPAA (“Covered Transactions”). Business Associate will make its
                        services and/or products compliant with HIPAA’s standards and
                        requirements no less than thirty (30) days prior to the
                        applicable compliance dates <br /> under HIPAA. Business Associate
                        represents and warrants that it is aware of all current HIPAA standards
                        and requirements regarding Covered Transactions, and Business Associate
                        shall comply with any modifications to HIPAA standards and requirements
                        which become effective from time to time. Business Associate shall
                        require all of its agents and subcontractors (if any) who assist
                        Business Associate in providing its services and/or products to comply
                        with the terms of this Section 6.
                    </p>

                    <h2 className="legal__section-title">7. Miscellaneous.</h2>
                    <h3 className="legal__section-sub-title">7.1 Regulatory References.</h3>
                    <p className="legal__text">
                        A reference in this BA Agreement to a section in HIPAA, means
                        the section as in effect or as amended or modified from time to
                        time, including any corresponding provisions of subsequent
                        superseding laws or regulations.
                    </p>

                    <h3 className="legal__section-sub-title">7.2 Amendment.</h3>
                    <p className="legal__text">
                        The Parties agree to take such action as is necessary to amend
                        the Services Agreement from time to time as is necessary for the
                        parties to comply with the requirements of HIPAA.
                    </p>

                    <h3 className="legal__section-sub-title">7.3 Survival.</h3>
                    <p className="legal__text">
                        The respective rights and obligations of Business Associate
                        under Section 5(c) of this BA Agreement shall survive the
                        termination of the Services Agreement or this BA Agreement.
                    </p>

                    <h3 className="legal__section-sub-title">7.4 Interpretation.</h3>
                    <p className="legal__text">
                        Any ambiguity in this Agreement shall be resolved to permit the
                        parties to comply with HIPAA.
                    </p>

                    <h3 className="legal__section-sub-title">7.5 Miscellaneous.</h3>
                    <p className="legal__text">
                        The terms of this BA Agreement are hereby incorporated into the
                        Services Agreement. To the extent that Business Associate
                        receives Protected Health Information from or on behalf of
                        Covered Entity and except as otherwise set forth in Section 7(d)
                        of this BA Agreement, in the event of a conflict between the
                        terms of this BA Agreement and the terms of the Services
                        Agreement, the terms of this BA Agreement shall prevail. The
                        terms of the Services Agreement which are not modified by this
                        BA Agreement shall remain in full force and effect in accordance
                        with the terms thereof. This BA Agreement shall be governed by,
                        and construed in accordance with, the laws of the State of
                        Florida, exclusive of conflict of law rules. Each party to this
                        BA Agreement hereby agrees and consents that any legal action or
                        proceeding with respect to this BA Agreement shall only be
                        brought in the courts of the state where the Business Associate
                        is located in the county where the Business Associate is
                        located. The Services Agreement together with this BA Agreement
                        constitutes the entire agreement between the parties with
                        respect to the subject matter contained herein, and this BA
                        Agreement supersedes and replaces any former business associate
                        agreement or addendum entered into by the parties. No amendments
                        or modifications to the BA Agreement shall be effected unless
                        executed by both parties in writing.
                    </p>
                </div>
            </Section>
        </div>
        
    );
}

export default BaaPage;





