describe('Testing the functionality', () => {
    it('should return an array of show objects', async () => {
        let response1 = await getShowsByTerm('westworld');
        let response2 = await getShowsByTerm('');
        expect(response1.length).toBeGreaterThan(0);
        expect(response2.length).toEqual(0);
        expect(Object.keys(response1[0]).sort()).toEqual(['id', 'image', 'name', 'summary']);
    });
    it('should return an array of episode objects', async () => {
        let response = await getEpisodesOfShow(1371);
        if (response.length !== 0) {
            expect(Object.keys(response[0]).sort()).toEqual(['id', 'name', 'number', 'season', 'summary']);
        }
    });
});

describe('Testing DOM Manipulation', () => {
    it('should populate showsList', () => {
        let $showsList = $('#showsList');
        let dummyShows = [
            {
                id: '123',
                image: 'https://unsplash.com/photos/OzAeZPNsLXk',
                name: 'test show',
                summary: '<p>test summary</p>'
            },
            {
                id: '0',
                image: 'https://unsplash.com/photos/OzAeZPNsLXk',
                name: 'test show 2',
                summary: '<p>test summary 2</p>'
            }
        ];
        populateShows(dummyShows);
        expect($showsList.children().length).toEqual(2);
        expect($showsList.children()[0].getAttribute('data-show-id')).toEqual(dummyShows[0].id);
        expect($showsList.children()[0].getAttribute('data-show-title')).toEqual(dummyShows[0].name);
        $showsList.empty();
    });

    it('should populate modal with episodes', () => {
        let $modalBody = $('.modal-body');
        let dummyShows = [
            {
                id: '123',
                number: '2',
                name: 'test episode',
                season: '1',
                summary: '<p>test summary</p>'
            },
            {
                id: '0',
                number: '3',
                name: 'test episode 2',
                season: '1',
                summary: '<p>test summary 2</p>'
            }
        ];
        populateEpisodes(dummyShows);
        expect($modalBody.children().length).toEqual(2);
        $showsList.empty();
    });
});