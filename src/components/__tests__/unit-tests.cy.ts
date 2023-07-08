import { formatURL } from "@/utils/formatURL";
import { computeElapsedTime } from "@/utils/computeElapsedTime";
import { formatSubscriberCount } from '@/utils/formatSubscriberCount';

describe('formatURL', () => {
  it('returns correct URL fragment for non-reddit URLs', () => {
    const url: string = 'https://www.cbsnews.com/news/boy-shot-dead-tampa-florida-jet-ski-dispute-grandfather-wounded/';
    const actualResult: string = formatURL(url) as string;
    expect(actualResult).to.equal('cbsnews.com/news/boy-s');
  });

  it('captures the URL fragment between https://www. and the second path', () => {
    const url: string = 'https://www.reddit.com/r/movies/comments/14s2hsm/how_is_flamin_hot_an_inspirational_story_when_it/';
    const actual: null = formatURL(url) as null;
    const expected = null;
    assert.equal(expected, actual);
  });
  
  it('returns null when given a URL to a reddit thread', () => {
    const url: string = 'https://www.reddit.com/r/AskMen/comments/14s92my/what_is_the_worst_thing_you_did_as_a_horny_teen/';
    const actualResult: null = formatURL(url) as null;
    expect(actualResult).to.equal(null);
  })


  it('returns null for reddit URLs linked to images', () => {
    const url: string = 'https://i.redd.it/w44eyr71sdab1.jpg';
    const actualResult: null = formatURL(url) as null;
    expect(actualResult).to.equal(null);
  })

  it('returns null when called with an empty string', () => {
    expect(formatURL('')).to.equal(null);
  });
});

describe('computeElapsedTime', () => {
  it('returns correct number of elapsed seconds', () => {
    /* Get the current number of milliseconds since unix epoch and subtract 50 seconds from it, 
    simulating a case in which a thread/comment was posted 50 seconds ago. */
    const currentTimeMinus50Secs = (new Date().getTime() / 1000) - 50;
    const expectedElapsedSecs = '50 seconds';
    const actualElapsedSecs = computeElapsedTime(currentTimeMinus50Secs);
    expect(expectedElapsedSecs).to.equal(actualElapsedSecs);
  });

  it('returns correct number of elapsed minutes', () => {
    const currentTimeMinus59Mins = (new Date().getTime() / 1000) - 3540; // 59 mins
    const expectedElapsedMins = '59 minutes';
    const actualElapsedMins = computeElapsedTime(currentTimeMinus59Mins);
    expect(expectedElapsedMins).to.equal(actualElapsedMins);
  });

  it('returns correct number of elapsed hours', () => {
    const currentTimeMinus23Hrs = (new Date().getTime() / 1000) - 8.28e4; // 23 hours
    const expectedElapsedHrs = '23 hours';
    const actualElapsedHrs = computeElapsedTime(currentTimeMinus23Hrs);
    expect(expectedElapsedHrs).to.equal(actualElapsedHrs);
  });

  it('returns correct number of elapsed days', () => {
    const currentTimeMinus6Days = (new Date().getTime() / 1000) - 5.184e5; // 6 days
    const expectedElapsedDays = '6 days';
    const actualElapsedDays = computeElapsedTime(currentTimeMinus6Days);
    expect(expectedElapsedDays).to.equal(actualElapsedDays);
  });

  it('returns correct number of elapsed months', () => {
    const currentTimeMinus8Months = (new Date().getTime() / 1000) - 2.3e7; // 8 months
    const expectedElapsedMonths = '8 months';
    const actualElapsedMonths = computeElapsedTime(currentTimeMinus8Months);
    expect(expectedElapsedMonths).to.equal(actualElapsedMonths);
  });

  it('returns correct number of elapsed years', () => {
    const currentTimeMinus4Yrs = (new Date().getTime() / 1000) - 1.51e8; // 4.8 years
    const expectedElapsedYrs = '4 years';
    const actualElapsedYrs = computeElapsedTime(currentTimeMinus4Yrs);
    expect(expectedElapsedYrs).to.equal(actualElapsedYrs);
  });

  it('returns string in singular grammatical form for time span values of 1', () => {
    const currentTimeMinus1Hour = (new Date().getTime() / 1000) - 5040; // 1 hour
    const currentTimeMinus1Day = (new Date().getTime() / 1000) - 1.7e5; // 1 day
    expect(computeElapsedTime(currentTimeMinus1Hour)).to.equal('1 hour');
    expect(computeElapsedTime(currentTimeMinus1Day)).to.equal('1 day');
  });
})

describe('formatSubscriberCount', () => {
  it('correctly formats subscriber counts under 10,000', () => {
    expect(formatSubscriberCount(0)).to.equal('0');
    expect(formatSubscriberCount(1)).to.equal('1');
    expect(formatSubscriberCount(9)).to.equal('9');
    expect(formatSubscriberCount(99)).to.equal('99');
    expect(formatSubscriberCount(112)).to.equal('112');
    expect(formatSubscriberCount(987)).to.equal('987');
    expect(formatSubscriberCount(1000)).to.equal('1000');
    expect(formatSubscriberCount(5500)).to.equal('5500');
    expect(formatSubscriberCount(9999)).to.equal('9999');
  });

  it('correctly formats subsriber counts under 100,000', () => {
    expect(formatSubscriberCount(10000)).to.equal('10k');
    expect(formatSubscriberCount(26793)).to.equal('27k');
    expect(formatSubscriberCount(58567)).to.equal('59k');
    expect(formatSubscriberCount(99999)).to.equal('100k');
  });

  it('correctl formats subscriber counts under 1M', () => {
    expect(formatSubscriberCount(100_000)).to.equal('100k');
    expect(formatSubscriberCount(100_578)).to.equal('101k');
    expect(formatSubscriberCount(585_621)).to.equal('586k');
    expect(formatSubscriberCount(999_499)).to.equal('999k');
  });

  it('correctly formats subscriber counts under 100M', () => {
    expect(formatSubscriberCount(999_500)).to.equal('1M');
    expect(formatSubscriberCount(1_986_765)).to.equal('1.99M');
    expect(formatSubscriberCount(99_499_999)).to.equal('99.5M');
  });

  it('correctly formats subscriber counts over 100M', () => {
    expect(formatSubscriberCount(100_000_000)).to.equal('100M');
    expect(formatSubscriberCount(100_500_000)).to.equal('101M');
  });
});